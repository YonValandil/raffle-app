import { createClient } from '@supabase/supabase-js';

// Bypasses RLS via the service_role key. Only safe in server contexts:
// webhooks, route handlers, server actions running on the server.
// NEVER import this from a Client Component or any code reachable from the browser bundle.

if (typeof window !== 'undefined') {
  throw new Error('lib/supabase/admin.ts must never be imported in client code');
}

let client: ReturnType<typeof createClient> | null = null;

export function createSupabaseAdminClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin environment variables');
  }

  client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return client;
}
