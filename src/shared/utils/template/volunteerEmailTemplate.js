import { getEmailLayout } from './emailLayout.js';

/**
 * Gera o template de e-mail em HTML para confirmacao de candidatura a voluntario.
 * 
 * @param {object} data - Dados do voluntario
 * @param {string} data.full_name - Nome completo
 * @param {string} data.email - E-mail
 * @param {string} data.phone - Telefone
 * @param {string} data.genero - Genero
 * @param {string} data.endereco - Endereco completo
 * @param {string} data.area_interesse - Area de interesse
 * @param {string} data.activityName - Nome da atividade de interesse selecionada
 * @param {string} data.message - Motivacao / mensagem opcional
 * @returns {string} HTML completo do e-mail
 */
export function getVolunteerEmailHtml(data) {
  const contentHtml = `
    <h2 style="color: #1B314C; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Obrigado por se candidatar a Voluntario!</h2>
    <p style="margin-bottom: 24px;">Ola <strong>${data.full_name}</strong>,</p>
    <p style="margin-bottom: 24px;">Estamos muito entusiasmados com a sua vontade de fazer a diferenca e colaborar com a ALEM! A sua candidatura a voluntario foi recebida com sucesso e ja se encontra no nosso sistema.</p>
    
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px; margin-bottom: 28px;">
      <h3 style="color: #3C5E82; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Dados da Candidatura</h3>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748B; width: 140px; font-weight: 600; vertical-align: top;">Atividade de Interesse:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.activityName || 'Nao especificada'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Area de Interesse:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.area_interesse || 'Nao especificada'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Contacto:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.phone || 'Nao fornecido'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Endereco:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.endereco || 'Nao fornecido'}</td>
        </tr>
        ${data.message ? `
        <tr>
          <td colspan="2" style="padding-top: 16px; border-top: 1px solid #E2E8F0; color: #64748B; font-weight: 600; padding-bottom: 6px;">Porque quer ser voluntario?</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px 12px; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 6px; color: #334155; line-height: 1.5; font-style: italic;">
            ${data.message.replace(/\n/g, '<br>')}
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    <p style="margin-bottom: 24px;">O que acontece a seguir?<br>
    A nossa equipa de coordenacao de voluntariado ira analisar o seu perfil e as vagas disponiveis para a atividade selecionada. Entraremos em contacto consigo para agendar uma breve conversa de integracao nos proximos dias.</p>
    
    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="https://alem.mz" target="_blank" style="background-color: #5E82AC; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 6px; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(94, 130, 172, 0.3);">Visitar o nosso Website</a>
    </div>

    <p style="margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 16px; color: #64748B; font-size: 14px;">
      Com muita gratidao,<br>
      <strong>Coordenacao de Voluntariado ALEM</strong>
    </p>
  `;

  return getEmailLayout(contentHtml, `Candidatura a Voluntario Recebida - ALEM`);
}

/**
 * Gera o template de e-mail em HTML para notificacao de candidatura de voluntario APROVADA.
 * 
 * @param {object} data - Dados do voluntario
 * @param {string} data.full_name - Nome completo
 * @param {string} data.email - E-mail
 * @param {string} [data.phone] - Telefone
 * @param {string} [data.activityName] - Nome da atividade atribuida
 * @param {string} [data.area_interesse] - Area de interesse
 * @returns {string} HTML completo do e-mail
 */
export function getVolunteerApprovedEmailHtml(data) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background-color: #DCFCE7; color: #15803D; font-weight: 700; font-size: 12px; text-transform: uppercase; padding: 6px 16px; border-radius: 9999px; letter-spacing: 1px; border: 1px solid #BBF7D0;">
        Candidatura Aprovada 🎉
      </span>
    </div>

    <h2 style="color: #1B314C; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">
      Parabéns! Bem-vindo(a) à Família ALEM!
    </h2>
    
    <p style="margin-bottom: 20px; font-size: 15px;">Olá <strong>${data.full_name}</strong>,</p>
    
    <p style="margin-bottom: 20px; line-height: 1.6;">
      É com enorme alegria que informamos que a sua candidatura a voluntário(a) foi <strong>aprovada com sucesso</strong> pela nossa equipa de coordenação!
    </p>
    
    <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 24px; margin-bottom: 28px;">
      <h3 style="color: #166534; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; letter-spacing: 0.5px; border-bottom: 1px solid #BBF7D0; padding-bottom: 8px;">
        Detalhes da Integração
      </h3>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #166534; width: 150px; font-weight: 600; vertical-align: top;">Voluntário(a):</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.full_name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #166534; font-weight: 600; vertical-align: top;">Atividade:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.activityName || data.area_interesse || 'Atividade Geral da ALEM'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #166534; font-weight: 600; vertical-align: top;">Estado:</td>
          <td style="padding: 6px 0; color: #15803D; font-weight: 700;">Aprovado & Ativo</td>
        </tr>
        ${data.phone ? `
        <tr>
          <td style="padding: 6px 0; color: #166534; font-weight: 600; vertical-align: top;">Contacto Registado:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.phone}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <h3 style="color: #1B314C; font-size: 16px; font-weight: 700; margin-bottom: 12px;">Próximos Passos:</h3>
    <ol style="margin-top: 0; margin-bottom: 24px; padding-left: 20px; line-height: 1.7; color: #334155;">
      <li>A nossa equipa de coordenação entrará em contacto através do seu telefone ou e-mail nos próximos dias para agendar a sua sessão de integração e boas-vindas.</li>
      <li>Receberá orientações sobre o funcionamento prático da sua atividade e os dias de ação no terreno.</li>
      <li>Será integrado(a) na rede de voluntários ativos da ALEM.</li>
    </ol>

    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="https://alem.mz" target="_blank" style="background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: bold; border-radius: 8px; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);">
        Aceder ao Website da ALEM
      </a>
    </div>

    <p style="margin-top: 28px; border-top: 1px solid #E2E8F0; padding-top: 16px; color: #64748B; font-size: 14px;">
      Obrigado por dedicar o seu tempo, talento e coração à nossa missão.<br>
      Juntos construímos laços de esperança!<br><br>
      Com os melhores cumprimentos,<br>
      <strong>Direção e Coordenação de Voluntariado — ALEM</strong>
    </p>
  `;

  return getEmailLayout(contentHtml, 'Parabéns! Candidatura a Voluntário Aprovada - ALEM');
}

