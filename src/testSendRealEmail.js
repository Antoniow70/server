import { sendEmail } from './infra/emailService.js';
import { getRecoveryEmailHtml } from './shared/utils/template/recoveryEmailTemplate.js';

async function testEmailSending() {
  const email = 'antoniofelixnhanombe@gmail.com';
  const testUrl = 'http://localhost:3000/admin/recuperar-senha?token_hash=test_token&email=' + encodeURIComponent(email);
  
  console.log('Testando envio de e-mail com Nodemailer para', email);
  const result = await sendEmail({
    to: email,
    subject: 'Recuperação de Palavra-passe - ALEM (Teste Direto)',
    html: getRecoveryEmailHtml({ email, resetUrl: testUrl, otpCode: '12345678' })
  });

  console.log('Resultado do envio:', result);
}

testEmailSending().catch(err => console.error('Erro no envio:', err));
