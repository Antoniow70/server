import { supabaseAdmin } from '../infra/supabaseAdmin.js';

export async function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token em falta.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      req.user = user;
      return next();
    }

    // Fallback: se o access_token expirou, valida o utilizador existente via admin API
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        if (payload && payload.sub) {
          const { data: adminUserData, error: adminUserErr } = await supabaseAdmin.auth.admin.getUserById(payload.sub);
          if (!adminUserErr && adminUserData?.user) {
            req.user = adminUserData.user;
            return next();
          }
        }
      }
    } catch (decodeErr) {
      // Ignora erro de descodificação
    }

    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao validar sessão.' });
  }
}
