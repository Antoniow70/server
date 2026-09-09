import { supabaseAdmin } from './infra/supabaseAdmin.js';

async function testRecovery() {
  console.log('--- TESTANDO RECUPERAÇÃO DE PALAVRA-PASSE VIA SUPABASE ---');
  const email = 'antoniofelixnhanombe@gmail.com';
  const redirectTo = 'http://localhost:3000/admin/recuperar-senha';

  console.log(`Disparando resetPasswordForEmail para ${email}...`);
  const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo
  });

  if (error) {
    console.error('❌ Erro no Supabase:', error);
  } else {
    console.log('✅ Chamada ao Supabase realizada com sucesso!', data);
    console.log(`Verifique a caixa de entrada de ${email} (e pasta de spam).`);
  }
}

testRecovery().catch(err => console.error(err));
