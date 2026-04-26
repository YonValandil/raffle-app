import type { NextRequest } from 'next/server';
import { createSupabaseProxyClient } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  const { supabase, response } = createSupabaseProxyClient(request);

  // Calling getUser() is what refreshes expired access tokens via the cookies adapter.
  // Routing rules (e.g. redirect to /login) will be added in Sprint 2.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on every request except static assets, optimised images, the favicon,
    // and webhook routes (which must not see any cookie/session middleware).
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
