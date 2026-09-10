import { getEmailLayout } from './emailLayout.js';

/**
 * Gera o template de e-mail em HTML para confirmacao de pedido de apoio.
 * 
 * @param {object} data - Dados da submissao de suporte
 * @param {string} data.name - Nome do solicitante
 * @param {string} data.email - E-mail do solicitante
 * @param {string} data.phone - Telefone
 * @param {string} data.genero - Genero
 * @param {string} data.data_nascimento - Data de nascimento
 * @param {string} data.endereco - Endereco completo
 * @param {string} data.tipo_necessidade - Tipo de necessidade/apoio
 * @param {string} data.message - Mensagem detalhada
 * @returns {string} HTML completo do e-mail
 */
export function getSupportEmailHtml(data) {
  const formattedDate = data.data_nascimento 
    ? new Date(data.data_nascimento).toLocaleDateString('pt-PT') 
    : 'Nao fornecida';

  const contentHtml = `
    <h2 style="color: #1B314C; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Recebemos o seu pedido de apoio</h2>
    <p style="margin-bottom: 24px;">Ola <strong>${data.name}</strong>,</p>
    <p style="margin-bottom: 24px;">Confirmamos que a ALEM recebeu o seu pedido de apoio com sucesso. A nossa equipa de assistencia social ira analisar a informacao partilhada com o maximo cuidado e atencao.</p>
    
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px; margin-bottom: 28px;">
      <h3 style="color: #3C5E82; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Detalhes do Pedido</h3>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748B; width: 140px; font-weight: 600; vertical-align: top;">Tipo de Apoio:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.tipo_necessidade || data.subject || 'Nao especificado'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Contacto:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.phone || 'Nao fornecido'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Data Nascimento:</td>
          <td style="padding: 6px 0; color: #1E293B;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Endereco:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.endereco || 'Nao fornecido'}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 16px; border-top: 1px solid #E2E8F0; color: #64748B; font-weight: 600; padding-bottom: 6px;">Descricao do Pedido:</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px 12px; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 6px; color: #334155; line-height: 1.5; font-style: italic;">
            ${data.message ? data.message.replace(/\n/g, '<br>') : 'Sem descricao adicional.'}
          </td>
        </tr>
      </table>
    </div>

    <p style="margin-bottom: 24px;">O nosso tempo medio de resposta e de 3 a 5 dias uteis. Entraremos em contacto atraves dos meios fornecidos (telefone ou e-mail) assim que a analise for concluida.</p>
    
    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="https://alem.mz" target="_blank" style="background-color: #5E82AC; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 6px; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(94, 130, 172, 0.3);">Visitar o nosso Website</a>
    </div>

    <p style="margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 16px; color: #64748B; font-size: 14px;">
      Com os melhores cumprimentos,<br>
      <strong>Equipa de Apoio Social ALEM</strong>
    </p>
  `;

  return getEmailLayout(contentHtml, `Recebemos o seu pedido de apoio - ALEM`);
}

/**
 * Gera o template de e-mail em HTML para atualizacao de estado do pedido de apoio (Aceito / Aprovado / Em Analise).
 * 
 * @param {object} data - Dados do pedido de apoio
 * @param {string} data.name - Nome do solicitante
 * @param {string} [data.tipo_necessidade] - Tipo de apoio
 * @param {string} [data.phone] - Contacto
 * @param {string} [data.bairro] - Bairro / Endereco
 * @param {string} status - Novo status ('Aceito', 'Aprovado', 'Em Analise')
 * @returns {string} HTML completo do e-mail
 */
export function getSupportStatusUpdateEmailHtml(data, status) {
  const isApproved = status === 'Aceito' || status === 'Aprovado';

  const badgeText = isApproved ? 'Pedido Aceito / Aprovado 🎉' : 'Pedido em Análise Social 📋';
  const badgeBg = isApproved ? '#DCFCE7' : '#EFF6FF';
  const badgeColor = isApproved ? '#15803D' : '#1D4ED8';
  const badgeBorder = isApproved ? '#BBF7D0' : '#BFDBFE';

  const titleText = isApproved 
    ? 'O seu pedido de apoio foi Aceito!' 
    : 'O seu pedido de apoio está em Análise';

  const mainMessage = isApproved
    ? 'Temos a satisfação de informar que a nossa equipa de assistência social analisou e <strong>deferiu favoravelmente</strong> o seu pedido de apoio. A ALEM está ao seu lado para proporcionar o auxílio necessário.'
    : 'Informamos que o seu pedido de apoio avançou para a fase de <strong>análise social aprofundada</strong>. A nossa equipa está a avaliar os detalhes com a devida dedicação e cuidado.';

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background-color: ${badgeBg}; color: ${badgeColor}; font-weight: 700; font-size: 12px; text-transform: uppercase; padding: 6px 16px; border-radius: 9999px; letter-spacing: 1px; border: 1px solid ${badgeBorder};">
        ${badgeText}
      </span>
    </div>

    <h2 style="color: #1B314C; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">
      ${titleText}
    </h2>
    
    <p style="margin-bottom: 20px; font-size: 15px;">Olá <strong>${data.name || 'Amigo(a)'}</strong>,</p>
    
    <p style="margin-bottom: 20px; line-height: 1.6;">
      ${mainMessage}
    </p>
    
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 24px; margin-bottom: 28px;">
      <h3 style="color: #3C5E82; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
        Resumo do Pedido
      </h3>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748B; width: 140px; font-weight: 600; vertical-align: top;">Beneficiário:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Tipo de Apoio:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.tipo_necessidade || 'Apoio Social'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Estado Atual:</td>
          <td style="padding: 6px 0; color: ${badgeColor}; font-weight: 700;">${status}</td>
        </tr>
        ${data.phone ? `
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Telefone:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.phone}</td>
        </tr>
        ` : ''}
        ${data.bairro || data.endereco ? `
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Bairro / Local:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.bairro || data.endereco}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${isApproved ? `
    <h3 style="color: #1B314C; font-size: 16px; font-weight: 700; margin-bottom: 12px;">Como será coordenado o apoio?</h3>
    <p style="line-height: 1.6; margin-bottom: 24px; color: #334155;">
      A equipa de apoio da ALEM entrará em contacto consigo telefonicamente para acertar os pormenores logísticos e a entrega/prestação do apoio. Por favor, mantenha o seu telemóvel disponível.
    </p>
    ` : `
    <p style="line-height: 1.6; margin-bottom: 24px; color: #334155;">
      Caso sejam necessárias informações complementares ou visita técnica, entraremos em contacto através dos contactos registados.
    </p>
    `}

    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="https://alem.mz" target="_blank" style="background-color: #5E82AC; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 6px; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(94, 130, 172, 0.3);">
        Visitar Website da ALEM
      </a>
    </div>

    <p style="margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 16px; color: #64748B; font-size: 14px;">
      Com os melhores cumprimentos,<br>
      <strong>Equipa de Apoio e Assistência Social — ALEM</strong>
    </p>
  `;

  return getEmailLayout(contentHtml, `${titleText} - ALEM`);
}

