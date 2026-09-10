import { supabaseAdmin } from '../../infra/supabaseAdmin.js';
import { sendEmail } from '../../infra/emailService.js';
import { getVolunteerEmailHtml, getVolunteerApprovedEmailHtml } from '../../shared/utils/template/volunteerEmailTemplate.js';

export async function getVolunteers(filters = {}) {
  let query = supabaseAdmin.from('volunteers').select('*', { count: 'exact' });
  
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
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters.page && filters.pageSize) {
    const from = (parseInt(filters.page) - 1) * parseInt(filters.pageSize);
    const to = from + parseInt(filters.pageSize) - 1;
    query = query.range(from, to);
  }
  
  const { data, error, count } = await query;
  if (error) throw error;

  // Manually fetch and populate activity names to avoid relationship issues
  if (data && data.length > 0) {
    const activityIds = [...new Set(data.map(v => v.activity_id).filter(Boolean))];
    if (activityIds.length > 0) {
      try {
        const { data: activitiesData, error: activitiesError } = await supabaseAdmin
          .from('activities')
          .select('id, name')
          .in('id', activityIds);
        
        if (!activitiesError && activitiesData) {
          const activitiesMap = activitiesData.reduce((acc, act) => {
            acc[act.id] = act;
            return acc;
          }, {});
          
          data.forEach(v => {
            if (v.activity_id && activitiesMap[v.activity_id]) {
              v.activities = { name: activitiesMap[v.activity_id].name };
            } else {
              v.activities = null;
            }
          });
        }
      } catch (err) {
        console.error('Error fetching activities for volunteers manually:', err);
      }
    }
  }
  
  return { data, count };
}

export async function deleteVolunteer(id) {
  const { error } = await supabaseAdmin
    .from('volunteers')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

async function notifyVolunteerApproved(volunteer) {
  if (!volunteer || !volunteer.email) return;

  let activityName = 'Atividade Geral da ALEM';
  if (volunteer.activity_id) {
    try {
      const { data: activityData } = await supabaseAdmin
        .from('activities')
        .select('name')
        .eq('id', volunteer.activity_id)
        .single();
      if (activityData?.name) {
        activityName = activityData.name;
      }
    } catch (e) {
      // Mantém fallback
    }
  }

  try {
    const html = getVolunteerApprovedEmailHtml({
      ...volunteer,
      activityName
    });

    await sendEmail({
      to: volunteer.email,
      subject: 'Parabéns! A sua candidatura a voluntário na ALEM foi aprovada! 🎉',
      html
    });
    console.log(`✅ [Voluntarios] E-mail de aprovação enviado com sucesso para ${volunteer.email}`);
  } catch (err) {
    console.error(`❌ [Voluntarios] Falha ao enviar e-mail de aprovação para ${volunteer.email}:`, err.message);
  }
}

export async function updateVolunteerStatus(id, status) {
  if (status === 'Pendente') {
    const { data: current } = await supabaseAdmin
      .from('volunteers')
      .select('status')
      .eq('id', id)
      .single();
    if (current && current.status === 'Aprovado') {
      const err = new Error('Não é permitido reverter uma candidatura já aprovada para pendente');
      err.status = 400;
      throw err;
    }
  }
  if (status === 'Recusado') {
    return deleteVolunteer(id);
  }
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  // Envia e-mail de comemoração quando aprovado
  if (status === 'Aprovado' && data) {
    notifyVolunteerApproved(data).catch(err => {
      console.error('⚠️ [Voluntarios] Erro assíncrono ao enviar e-mail de aprovação:', err);
    });
  }

  return data;
}

export async function markVolunteerRead(id) {
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .update({ read_status: 'Lido' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function bulkUpdateVolunteerStatus(ids, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabaseAdmin.from('volunteers').delete().in('id', ids);
    if (error) throw error;
    return { message: 'Candidaturas eliminadas com sucesso.' };
  }
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .update({ status: newStatus })
    .in('id', ids)
    .select();
  if (error) throw error;

  // Se o lote for de aprovação, envia para cada voluntário aprovado
  if (newStatus === 'Aprovado' && Array.isArray(data)) {
    data.forEach(v => {
      notifyVolunteerApproved(v).catch(err => {
        console.error('⚠️ [Voluntarios] Erro ao enviar e-mail de aprovação em lote:', err);
      });
    });
  }

  return data;
}

export async function submitVolunteer(payload) {
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .insert([{
      ...payload,
      status: 'Pendente',
      read_status: 'Nao Lido'
    }])
    .select()
    .single();
  if (error) throw error;

  // Enviar e-mail de confirmação em segundo plano (não bloqueia a resposta da API)
  if (data && data.email) {
    (async () => {
      let activityName = 'Atividade Selecionada';
      try {
        const { data: activityData } = await supabaseAdmin
          .from('activities')
          .select('name')
          .eq('id', data.activity_id)
          .single();
        if (activityData) {
          activityName = activityData.name;
        }
      } catch (err) {
        console.error('⚠️ [EmailService] Erro ao obter nome da atividade:', err);
      }

      try {
        const html = getVolunteerEmailHtml({
          ...data,
          activityName
        });
        await sendEmail({
          to: data.email,
          subject: 'Candidatura a Voluntário Recebida - ALEM',
          html
        });
      } catch (err) {
        console.error('⚠️ [EmailService] Falha ao enviar e-mail de confirmação de voluntário:', err);
      }
    })();
  }

  return data;
}

export async function saveVolunteer(payload, editingId) {
  if (editingId) {
    const { data, error } = await supabaseAdmin
      .from('volunteers')
      .update(payload)
      .eq('id', editingId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('volunteers')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
