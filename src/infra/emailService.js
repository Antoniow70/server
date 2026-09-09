import nodemailer from 'nodemailer';
import dns from 'dns';
import { config } from '../config/env.js';

// No Node 17+, força resolução IPv4 primeiro para evitar ENETUNREACH em plataformas sem suporte IPv6 (ex: Render)
if (dns.setDefaultResultOrder) {
  try {
    dns.setDefaultResultOrder('ipv4first');
  } catch (e) {
    // Silencioso se o ambiente não permitir
  }
}

let transporter = null;

/**
 * Obtém ou inicializa o transportador SMTP do Nodemailer.
 * Retorna null se as credenciais do e-mail não estiverem configuradas.
 */
function getTransporter() {
  if (transporter) return transporter;

  const user = config.emailUser;
  const pass = config.emailPass;

  if (!user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    family: 4, // Força estritamente IPv4
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: {
      user,
      pass
    }
  });

  return transporter;
}

/**
 * Envia um e-mail de forma assíncrona.
 * Suporta:
 * 1. Resend API (HTTP/HTTPS porta 443 - recomendado para Render Free onde portas SMTP são bloqueadas)
 * 2. Nodemailer SMTP (com IPv4 forçado)
 * 3. Simulação (se nenhuma credencial estiver configurada)
 * 
 * @param {object} options
 * @param {string} options.to - E-mail do destinatário
 * @param {string} options.subject - Assunto do e-mail
 * @param {string} options.html - Conteúdo HTML do e-mail
 * @returns {Promise<object>} Detalhes do envio
 */
export async function sendEmail({ to, subject, html }) {
  // 1. Envio via Resend API (HTTPS porta 443 - 100% livre de bloqueio em nuvem)
  if (config.resendApiKey) {
    try {
      const fromEmail = config.emailUser && config.emailUser.includes('@')
        ? `ALEM <${config.emailUser}>`
        : 'ALEM <onboarding@resend.dev>';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }

      console.log(`✅ [EmailService] E-mail enviado com sucesso para ${to} via Resend API. ID: ${data.id}`);
      return { success: true, messageId: data.id };
    } catch (resendError) {
      console.error(`❌ [EmailService] Erro ao enviar via Resend API para ${to}:`, resendError.message);
      throw resendError;
    }
  }

  // 2. Envio via SMTP (Nodemailer)
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    console.log('────────────────────────────────────────────────────────────');
    console.log(`✉️ [EmailService (SIMULAÇÃO)] Nenhuma credencial configurada.`);
    console.log(`Destinatário: ${to}`);
    console.log(`Assunto:      ${subject}`);
    console.log('────────────────────────────────────────────────────────────');
    return { success: true, mocked: true };
  }

  try {
    const info = await mailTransporter.sendMail({
      from: `"ALEM" <${config.emailUser}>`,
      to,
      subject,
      html
    });
    console.log(`✅ [EmailService] E-mail enviado com sucesso para ${to} via SMTP. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Alerta específico para o bloqueio de portas SMTP do Render Free
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET' || error.code === 'ENETUNREACH') {
      console.warn(`⚠️ [EmailService] O Render Free bloqueia conexões SMTP diretas (portas 465/587). Para envio real em produção sem custos, adicione a variável RESEND_API_KEY no painel do Render.`);
    }
    console.error(`❌ [EmailService] Erro ao enviar e-mail para ${to}:`, error.message || error);
    throw error;
  }
}
