import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;
const HOST = config.host || '0.0.0.0';

// Captura erros não tratados para diagnóstico em produção (ex: Render logs)
process.on('uncaughtException', (err) => {
  console.error('❌ [Server] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ [Server] Unhandled Rejection:', reason);
  process.exit(1);
});

app.listen(PORT, HOST, () => {
  console.log(`\n Backend ALEM a correr em http://${HOST}:${PORT}`);
  console.log(`   Local:   http://localhost:${PORT}/api/health`);
  console.log(`   Rede:    http://0.0.0.0:${PORT}/api/health`);
  console.log(`   Ambiente: ${config.nodeEnv}`);
  console.log(`   Supabase URL: ${config.supabaseUrl ? '✅ configurado' : '❌ em falta'}\n`);
});
