import { getEmailLayout } from './emailLayout.js';

/**
 * Gera o template de e-mail em HTML para confirmacao de doacao recebida.
 * Enviado ao doador quando o administrador muda o estado para "Recebido".
 * 
 * @param {object} data - Dados da doacao
 * @param {string} data.nome - Nome do doador
 * @param {string} data.email - E-mail do doador
 * @param {string} data.telefone - Telefone do doador
 * @param {string} data.causa - Causa/projeto apoiado
 * @param {number|string} data.valor - Valor doado (MZN)
 * @param {string} data.metodo_pagamento - Metodo de pagamento utilizado
 * @param {string} data.mensagem - Mensagem opcional do doador
 * @returns {string} HTML completo do e-mail
 */
export function getDonationReceivedEmailHtml(data) {
  const isConfirmed = data.status === 'Recebido' || data.status === 'Confirmado' || data.status === 'Aprovado';

  const titleText = isConfirmed ? 'A sua Doacao foi Confirmada!' : 'Declaracao de Doacao Recebida!';
  const messageText = isConfirmed 
    ? 'Temos o prazer de confirmar que a sua doacao foi <strong style="color: #22C55E;">recebida e validada com sucesso</strong>. Agradecemos profundamente a sua generosidade e contribuicao para a causa da ALEM.'
    : 'Recebemos a sua declaracao de doacao. A nossa equipa ira verificar a transacao e assim que for validada, enviaremos a confirmacao final.';

  const badgeColor = isConfirmed ? '#22C55E' : '#EAB308';
  const badgeBg = isConfirmed ? '#F0FDF4' : '#FEFCE8';
  const badgeBorder = isConfirmed ? '#BBF7D0' : '#FEF08A';
  const statusLabel = isConfirmed ? 'Recebido' : 'Pendente (Em Verificacao)';

  const contentHtml = `
    <h2 style="color: #1B314C; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">${titleText}</h2>
    <p style="margin-bottom: 24px;">Ola <strong>${data.nome}</strong>,</p>
    <p style="margin-bottom: 24px;">${messageText}</p>
    
    <div style="background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 8px; padding: 24px; margin-bottom: 28px;">
      <h3 style="color: #1B314C; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; letter-spacing: 0.5px; border-bottom: 1px solid ${badgeBorder}; padding-bottom: 8px;">Detalhes da Doacao</h3>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748B; width: 160px; font-weight: 600; vertical-align: top;">Doador:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.nome}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">E-mail:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.email}</td>
        </tr>
        ${data.telefone ? `
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Telefone:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.telefone}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Causa Apoiada:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.causa || 'Geral'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Metodo de Pagamento:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.metodo_pagamento || 'Nao especificado'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Estado:</td>
          <td style="padding: 6px 0;">
            <span style="background-color: ${badgeColor}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;">${statusLabel}</span>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin-bottom: 24px;">A sua contribuicao faz uma enorme diferenca na vida de pessoas com necessidades especiais em Mocambique. Cada doacao permite-nos continuar a desenvolver programas de educacao inclusiva, formacao profissional e apoio comunitario.</p>
    
    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="https://alem.mz" target="_blank" style="background-color: #22C55E; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 6px; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);">Conhecer os Nossos Projetos</a>
    </div>

    <p style="margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 16px; color: #64748B; font-size: 14px;">
      Com muita gratidao,<br>
      <strong>Equipa ALEM</strong><br>
      <em>Associacao Lacos Especiais de Mocambique</em>
    </p>
  `;

  return getEmailLayout(contentHtml, isConfirmed ? 'Doacao Confirmada - ALEM' : 'Declaracao de Doacao Recebida - ALEM');
}
