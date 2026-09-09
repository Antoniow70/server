import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './infra/supabaseAdmin.js';
import { config } from './config/env.js';

async function testDirectVerify() {
  const email = 'antoniofelixnhanombe@gmail.com';
  console.log('1. Gerando link administrativo no Supabase...');
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email
  });

  if (error) {
    console.error('Erro generateLink:', error);
    return;
  }

  const { hashed_token, email_otp } = data.properties;
  console.log('Hashed Token:', hashed_token);
  console.log('Email OTP:', email_otp);

  // Testa cliente público simulando o navegador
  const supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);

  console.log('2. Testando verifyOtp com token_hash no cliente público...');
  const { data: verifyData, error: verifyError } = await supabaseClient.auth.verifyOtp({
    token_hash: hashed_token,
    type: 'recovery'
  });

  if (verifyError) {
    console.error('❌ Erro verifyOtp com token_hash:', verifyError);
  } else {
    console.log('✅ verifyOtp com token_hash funcionou perfeitamente!');
    console.log('Sessão obtida:', verifyData.session ? 'Sim (Token presente)' : 'Não');
    console.log('User ID:', verifyData.user?.id);
  }
}

testDirectVerify().catch(err => console.error(err));
