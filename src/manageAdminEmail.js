import { supabaseAdmin } from './infra/supabaseAdmin.js';

async function manageAdminEmail() {
  console.log('--- 1. CONSULTANDO UTILIZADORES NO SUPABASE ---');
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Erro ao listar utilizadores:', listError);
    return;
  }

  if (!users || users.length === 0) {
    console.log('⚠️ Nenhum utilizador encontrado no Supabase Auth.');
    return;
  }

  console.log(`Encontrado(s) ${users.length} utilizador(es):`);
  users.forEach((u, i) => {
    console.log(`[${i + 1}] ID: ${u.id}`);
    console.log(`    E-mail atual: ${u.email}`);
    console.log(`    Confirmado em: ${u.email_confirmed_at || 'Não confirmado'}`);
    console.log(`    Último login: ${u.last_sign_in_at || 'Nunca'}`);
    console.log(`    Criado em: ${u.created_at}`);
  });

  // Atualizar para o novo e-mail
  const targetUser = users[0]; // ou o utilizador admin existente
  const newEmail = 'antoniofelixnhanombe@gmail.com';

  console.log('\n--- 2. ATUALIZANDO E-MAIL DO ADMIN ---');
  console.log(`Alterando de "${targetUser.email}" para "${newEmail}"...`);

  if (targetUser.email === newEmail) {
    console.log('✅ O e-mail já está configurado como ' + newEmail);
    return;
  }

  const { data: updatedData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    targetUser.id,
    {
      email: newEmail,
      email_confirm: true
    }
  );

  if (updateError) {
    console.error('❌ Erro ao atualizar e-mail:', updateError);
    return;
  }

  console.log('✅ E-mail atualizado com sucesso no Supabase Auth!');
  console.log(`ID: ${updatedData.user.id}`);
  console.log(`Novo E-mail: ${updatedData.user.email}`);
  console.log(`E-mail confirmado: ${updatedData.user.email_confirmed_at ? 'Sim' : 'Não'}`);
}

manageAdminEmail().catch(err => console.error('Erro fatal:', err));
