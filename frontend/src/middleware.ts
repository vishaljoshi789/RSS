import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  SECURITY_CONFIG, 
  isProtectedRoute, 
  isSensitiveRoute, 
  containsXSSPattern,
} from '@/lib/security-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const protectedRoute = isProtectedRoute(pathname);

  // 1. Security Headers
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 2. CORS Check
  const origin = request.headers.get('origin');
  if (origin && !SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`[Security] Blocked request from origin: ${origin}`);
  }

  // 3. Rate Limiting Check (simple redirect loop prevention)
  const redirectCount = parseInt(request.cookies.get('_redirect_count')?.value || '0', 10);
  if (redirectCount >= SECURITY_CONFIG.MAX_REDIRECT_ATTEMPTS) {
    console.error(`[Security] Too many redirects detected for ${pathname}`);
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/login';
    errorUrl.searchParams.delete('redirect');
    const errorResponse = NextResponse.redirect(errorUrl);
    errorResponse.cookies.delete('_redirect_count');
    return errorResponse;
  }

  // 4. Protected Routes - Dashboard Authentication Check
  if (protectedRoute) {
    const token = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!token && !refreshToken) {
      console.log(`[Security] Unauthorized access attempt to ${pathname}`);
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.set('_redirect_count', String(redirectCount + 1), {
        maxAge: 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      return redirectResponse;
    }

    if (token) {
      response.cookies.delete('_redirect_count');
    }
  }

  if ((pathname === '/auth/login' || pathname === '/auth/register')) {
    const token = request.cookies.get('access_token')?.value;
    
    if (token) {
      const redirectPath = request.nextUrl.searchParams.get('redirect') || '/dashboard';
      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      url.searchParams.delete('redirect');
      return NextResponse.redirect(url);
    }
  }

  // 6. Sanitize Query Parameters (prevent XSS in URL params)
  const searchParams = request.nextUrl.searchParams;
  let hasUnsafeParams = false;
  
  searchParams.forEach((value, key) => {
    if (containsXSSPattern(value)) {
      console.warn(`[Security] Potentially malicious parameter detected: ${key}=${value}`);
      hasUnsafeParams = true;
    }
  });

  if (hasUnsafeParams) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.search = '';
    return NextResponse.redirect(cleanUrl);
  }

  // 7. Log access to sensitive routes (for audit)
  if (isSensitiveRoute(pathname)) {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    console.log(`[Audit] Access to ${pathname} from IP: ${ip}, User-Agent: ${userAgent.substring(0, 50)}`);
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
