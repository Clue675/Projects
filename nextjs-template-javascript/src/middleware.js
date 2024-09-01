import { NextResponse } from 'next/server';

import { config as appConfig } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';
import { supabaseMiddleware } from '@/lib/auth/supabase/middleware';

export async function middleware(req) {
  let res;

  if (appConfig.auth.strategy === AuthStrategy.SUPABASE) {
    res = await supabaseMiddleware(req);
  } else {
    res = NextResponse.next({ headers: req.headers });
  }

  return res;
}

export const config = { matcher: ['/auth/:path*', '/dashboard/:path*'] };
