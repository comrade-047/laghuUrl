// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/finish-signup');

  // If the user is authenticated (has a token)
  if (token) {
    // If they haven't set a username, force them to the finish-signup page.
    if (!token.username && pathname !== '/finish-signup' && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/finish-signup', req.url));
    }

    // If their profile is complete and they try to visit an auth page, redirect to dashboard.
    if (token.username && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } 
  // If the user is NOT authenticated
  else {
    // And they are trying to access a protected page, redirect them to the login page.
    const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/finish-signup');
    if (isProtectedPage) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// This specifies which routes the middleware should run on.
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/finish-signup'],
};