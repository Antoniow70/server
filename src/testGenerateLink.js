import { supabaseAdmin } from './infra/supabaseAdmin.js';

async function testGenerateLink() {
  const email = 'antoniofelixnhanombe@gmail.com';
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: 'http://localhost:3000/admin/recuperar-senha'
    }
  });

  if (error) {
    console.error('❌ Erro generateLink:', error);
  } else {
    console.log('✅ Sucesso generateLink:');
    console.log(JSON.stringify(data, null, 2));
  }
}

testGenerateLink().catch(err => console.error(err));
