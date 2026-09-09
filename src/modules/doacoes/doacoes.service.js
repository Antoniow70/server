import { supabaseAdmin } from '../../infra/supabaseAdmin.js';
import { sendEmail } from '../../infra/emailService.js';
import { getDonationReceivedEmailHtml } from '../../shared/utils/template/donationEmailTemplate.js';

export async function getDonations(filters = {}) {
  let query = supabaseAdmin.from('donations').select('*', { count: 'exact' });

  if (filters.status && filters.status !== 'Todos') {
    if (filters.status === 'Recebido') {
      query = query.in('status', ['Recebido', 'Confirmado']);
    } else {
      query = query.eq('status', filters.status);
    }
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
  }

  query = query.order('created_at', { ascending: false });

  if (filters.page && filters.pageSize) {
    const from = (parseInt(filters.page) - 1) * parseInt(filters.pageSize);
    const to = from + parseInt(filters.pageSize) - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const normalizedData = (data || []).map(d => ({
    ...d,
    status: (d.status === 'Confirmado' || d.status === 'Recebido') ? 'Recebido' : d.status
  }));

  return { data: normalizedData, count };
}

export async function getDonationsTotalByPeriod(dateFrom, dateTo) {
  let query = supabaseAdmin.from('donations').select('valor').in('status', ['Recebido', 'Confirmado']);
  if (dateFrom) {
    query = query.gte('created_at', `${dateFrom}T00:00:00`);
  }
  if (dateTo) {
    query = query.lte('created_at', `${dateTo}T23:59:59`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
}

export async function deleteDonation(id) {
  const { error } = await supabaseAdmin
    .from('donations')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateDonationStatus(id, status) {
  if (status === 'Nao Recebido' || status === 'Recusado') {
    return deleteDonation(id);
  }

  // O check constraint no Supabase utiliza ('Pendente', 'Confirmado', 'Recusado')
  let dbStatus = status;
  if (status === 'Recebido') {
    dbStatus = 'Confirmado';
  }

  let data = null;
  let { data: updatedData, error } = await supabaseAdmin
    .from('donations')
    .update({ status: dbStatus })
    .eq('id', id)
    .select()
    .single();

  if (error && error.code === '23514') {
    const fallbackStatus = dbStatus === 'Confirmado' ? 'Recebido' : 'Confirmado';
    const retry = await supabaseAdmin
      .from('donations')
      .update({ status: fallbackStatus })
      .eq('id', id)
      .select()
      .single();
    if (!retry.error) {
      updatedData = retry.data;
      error = null;
    }
  }

  if (error) throw error;
  data = updatedData;

  const normalizedData = data ? {
    ...data,
    status: (data.status === 'Confirmado' || data.status === 'Recebido') ? 'Recebido' : data.status
  } : data;

  // Enviar e-mail de confirmacao ao doador quando o estado muda para "Recebido" ou "Confirmado"
  if ((status === 'Recebido' || status === 'Confirmado' || dbStatus === 'Confirmado') && normalizedData && normalizedData.email) {
    sendEmail({
      to: normalizedData.email,
      subject: 'Doacao Confirmada - ALEM',
      html: getDonationReceivedEmailHtml(normalizedData)
    }).catch(emailError => {
      console.error(`⚠️ Erro ao enviar e-mail de confirmacao de doacao para ${normalizedData.email}:`, emailError.message);
    });
  }

  return normalizedData;
}

export async function submitDonation(payload) {
  const { data, error } = await supabaseAdmin
    .from('donations')
    .insert([{
      ...payload,
      status: 'Pendente'
    }])
    .select()
    .single();
  if (error) throw error;

  // Enviar e-mail de registo/declaracao em segundo plano
  if (data && data.email) {
    sendEmail({
      to: data.email,
      subject: 'Registo de Doacao Recebido - ALEM',
      html: getDonationReceivedEmailHtml({ ...data, status: 'Pendente' })
    }).catch(err => {
      console.error('⚠️ [EmailService] Falha ao enviar e-mail de declaracao de doacao:', err);
    });
  }

  return data;
}
