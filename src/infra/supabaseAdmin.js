import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from '../config/env.js';

const supabaseUrl = config.supabaseUrl;
const supabaseServiceRoleKey = config.supabaseServiceRoleKey;

if (!supabaseUrl) {
  console.warn('⚠️ [Backend] SUPABASE_URL não configurada no ficheiro .env. Por favor, configure as credenciais no arquivo server/.env');
}

const urlToUse = supabaseUrl && supabaseUrl.startsWith('http')
  ? supabaseUrl
  : 'https://placeholder-project.supabase.co';

const keyToUse = supabaseServiceRoleKey || 'placeholder-key';

export const supabaseAdmin = createClient(urlToUse, keyToUse, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  realtime: {
    transport: ws
  }
});
