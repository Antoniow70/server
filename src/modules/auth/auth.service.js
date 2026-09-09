import { supabaseAdmin } from '../../infra/supabaseAdmin.js';
import { sendEmail } from '../../infra/emailService.js';
import { getRecoveryEmailHtml } from '../../shared/utils/template/recoveryEmailTemplate.js';

export async function login(email, password) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout(token) {
  // Supabase signout requires client/admin role
  const { error } = await supabaseAdmin.auth.signOut();
  if (error) throw error;
}

export async function requestPasswordRecovery(email) {
  const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUrl = `${clientUrl}/admin/recuperar-senha`;

  let directResetUrl = null;
  let otpCode = null;

  try {
    // 1. Gera link e token administrativo oficial do Supabase
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email
    });

    if (!error && data?.properties) {
      const { hashed_token, email_otp } = data.properties;
      otpCode = email_otp;
      directResetUrl = `${clientUrl}/admin/recuperar-senha?token_hash=${hashed_token}&email=${encodeURIComponent(email)}`;
      console.log(`🔑 [AuthService] Link gerado com sucesso para ${email} (OTP: ${otpCode})`);
    }
  } catch (err) {
    console.warn('⚠️ [AuthService] Aviso ao gerar link administrativo:', err.message);
  }

  // Se não foi possível obter o hashed_token, aciona fallback do Supabase
  if (!directResetUrl) {
    try {
      await supabaseAdmin.auth.resetPasswordForEmail(email, {
        redirectTo: `${clientUrl}/admin/recuperar-senha`
      });
      directResetUrl = `${clientUrl}/admin/recuperar-senha`;
    } catch (resetErr) {
      console.warn('⚠️ [AuthService] Aviso ao acionar resetPasswordForEmail:', resetErr.message);
    }
  }

  // 2. Enviar e-mail institucional via Nodemailer (Gmail da ALEM)
  if (directResetUrl) {
    try {
      await sendEmail({
        to: email,
        subject: 'Recuperação de Palavra-passe - ALEM',
        html: getRecoveryEmailHtml({ 
          email, 
          resetUrl: directResetUrl,
          otpCode
        })
      });
    } catch (mailErr) {
      console.error('⚠️ [AuthService] Erro ao enviar e-mail de recuperação:', mailErr);
    }
  }

  return { 
    message: 'Link e código de recuperação enviados com sucesso para o seu e-mail!' 
  };
}

export async function resetPassword(userId, newPassword) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  });
  if (error) throw error;
  return data;
}

