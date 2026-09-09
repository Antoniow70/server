import { getEmailLayout } from './emailLayout.js';

/**
 * Gera o template de e-mail em HTML para recuperacao de palavra-passe da ALEM.
 * 
 * @param {object} data
 * @param {string} data.email - E-mail do utilizador
 * @param {string} data.resetUrl - URL segura com token para redefinicao
 * @returns {string} HTML completo do e-mail
 */
export function getRecoveryEmailHtml({ email, resetUrl, otpCode }) {
  const contentHtml = `
    <h2 style="color: #1B314C; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Recuperação de Palavra-passe</h2>
    <p style="margin-bottom: 16px;">Olá,</p>
    <p style="margin-bottom: 24px;">Recebemos um pedido para redefinir a palavra-passe da conta de administrador associada ao e-mail <strong>${email}</strong>.</p>
    
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin-top: 0; margin-bottom: 20px; color: #475569; font-size: 14px;">
        Clique no botão abaixo para definir a sua nova palavra-passe diretamente:
      </p>
      
      <a href="${resetUrl}" target="_blank" style="background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: bold; border-radius: 8px; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(22, 163, 74, 0.3);">
        Redefinir Palavra-passe
      </a>

      ${otpCode ? `
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px dashed #CBD5E1;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
          Ou utilize o código de verificação:
        </p>
        <span style="font-family: monospace; font-size: 24px; font-weight: 800; letter-spacing: 6px; color: #1E293B; background-color: #E2E8F0; padding: 6px 16px; border-radius: 6px; display: inline-block;">
          ${otpCode}
        </span>
      </div>
      ` : ''}

      <p style="margin-top: 20px; margin-bottom: 0; color: #94a3b8; font-size: 12px;">
        Se o botão não funcionar, copie e cole o seguinte link no seu navegador:<br>
        <span style="word-break: break-all; color: #2563eb;">${resetUrl}</span>
      </p>
    </div>

    <p style="margin-bottom: 16px; color: #64748b; font-size: 13px;">
      <strong>Nota de Segurança:</strong> Este link é válido por tempo limitado. Se não solicitou a recuperação da sua palavra-passe, por favor ignore esta mensagem. A sua conta permanecerá segura e a senha atual não será alterada.
    </p>
  `;

  return getEmailLayout(contentHtml, 'Recuperação de Palavra-passe - ALEM');
}
