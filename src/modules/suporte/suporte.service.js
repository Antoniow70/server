import { supabaseAdmin } from '../../infra/supabaseAdmin.js';
import { sendEmail } from '../../infra/emailService.js';
import { getSupportEmailHtml, getSupportStatusUpdateEmailHtml } from '../../shared/utils/template/supportEmailTemplate.js';

async function notifySupportStatusChange(messageRecord, status) {
  if (!messageRecord || !messageRecord.email) return;

  const relevantStatuses = ['Aceito', 'Aprovado', 'Em Analise'];
  if (!relevantStatuses.includes(status)) return;

  try {
    const html = getSupportStatusUpdateEmailHtml(messageRecord, status);
    const subjectTitle = (status === 'Aceito' || status === 'Aprovado')
      ? 'O seu pedido de apoio foi Aceito! - ALEM 🎉'
      : 'O seu pedido de apoio está em Análise - ALEM';

    await sendEmail({
      to: messageRecord.email,
      subject: subjectTitle,
      html
    });
    console.log(`✅ [Suporte] E-mail de status (${status}) enviado com sucesso para ${messageRecord.email}`);
  } catch (err) {
    console.error(`❌ [Suporte] Falha ao enviar e-mail de status para ${messageRecord.email}:`, err.message);
  }
}

export async function getMessages(filters = {}) {
  let query = supabaseAdmin.from('messages').select('*', { count: 'exact' });

  if (filters.status && filters.status !== 'Todos') {
    query = query.eq('status', filters.status);
  }
  if (filters.read_status && filters.read_status !== 'Todos') {
    query = query.eq('read_status', filters.read_status);
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
  }

  query = query.order('created_at', { ascending: false });

  if (filters.page && filters.pageSize) {
    const from = (parseInt(filters.page) - 1) * parseInt(filters.pageSize);
    const to = from + parseInt(filters.pageSize) - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function deleteMessage(id) {
  const { error } = await supabaseAdmin
    .from('messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateMessageStatus(id, status) {
  if (status === 'Recusado') {
    return deleteMessage(id);
  }
  const { data, error } = await supabaseAdmin
    .from('messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23514') {
      const { data: msg } = await supabaseAdmin.from('messages').select('*').eq('id', id).single();
      const fallbackRecord = msg ? { ...msg, status } : { id, status };
      notifySupportStatusChange(fallbackRecord, status).catch(e => console.error(e));
      return fallbackRecord;
    }
    throw error;
  }

  // Notificar beneficiário por e-mail quando o status muda para Aceito / Aprovado / Em Analise
  if (data) {
    notifySupportStatusChange(data, status).catch(err => {
      console.error('⚠️ [Suporte] Erro ao disparar e-mail de atualização de apoio:', err);
    });
  }

  return data;
}

export async function markMessageRead(id) {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .update({ read_status: 'Lido' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function bulkUpdateMessageStatus(ids, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabaseAdmin.from('messages').delete().in('id', ids);
    if (error) throw error;
    return { message: 'Mensagens eliminadas com sucesso.' };
  }
  const { data, error } = await supabaseAdmin
    .from('messages')
    .update({ status: newStatus })
    .in('id', ids)
    .select();

  if (error) {
    if (error.code === '23514') {
      const { data: msgs } = await supabaseAdmin.from('messages').select('*').in('id', ids);
      const fallbackList = (msgs || []).map(m => ({ ...m, status: newStatus }));
      fallbackList.forEach(m => notifySupportStatusChange(m, newStatus).catch(e => console.error(e)));
      return fallbackList;
    }
    throw error;
  }

  if (Array.isArray(data)) {
    data.forEach(m => {
      notifySupportStatusChange(m, newStatus).catch(err => {
        console.error('⚠️ [Suporte] Erro ao disparar e-mail em lote:', err);
      });
    });
  }

  return data;
}

export async function submitMessage(payload) {
  const { endereco, subject, message, ...dbPayload } = payload;
  if (endereco && !dbPayload.bairro) {
    dbPayload.bairro = endereco;
  }

  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert([{
      ...dbPayload,
      status: 'Pendente',
      read_status: 'Nao Lido'
    }])
    .select()
    .single();
  if (error) throw error;

  // Enviar e-mail de confirmação em segundo plano (não bloqueia a resposta da API)
  if (data && data.email) {
    sendEmail({
      to: data.email,
      subject: 'Recebemos o seu pedido de apoio - ALEM',
      html: getSupportEmailHtml({ ...payload, ...data })
    }).catch(err => {
      console.error('⚠️ [EmailService] Falha ao enviar e-mail de confirmação de apoio:', err);
    });
  }

  return data;
}
