const PROTECTED_ROUTE_PATTERNS = ['/dashboard'] as const;
const PROTECTED_ROUTE_MATCHERS = ['/dashboard/:path*'] as const;

export const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REDIRECT_ATTEMPTS: 3,
  REDIRECT_TIMEOUT_SECONDS: 60,
  
  // Session settings
  SESSION_COOKIE_NAME: 'access_token',
  REFRESH_COOKIE_NAME: 'refresh_token',
  SESSION_TIMEOUT_MINUTES: 60,
  
  // CORS settings
  ALLOWED_ORIGINS: [
    process.env.NEXT_PUBLIC_API_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean) as string[],
  
  SECURITY_HEADERS: {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    // 'Content-Security-Policy': `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'} http://localhost:8000 http://127.0.0.1:8000; img-src 'self' data: blob: https:; font-src 'self' data:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; media-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;`,
  },
  
  PUBLIC_ROUTES: [
    '/',
    '/about-us',
    '/contact-us',
    '/auth/login',
    '/auth/register',
    '/become-member',
    '/vyapari',
    '/vyapari/businesses',
    '/vyapari/category',
    '/vyapari/s',
    '/gallery',
    '/blog',
    '/donate-now',
    '/founders-team-members',
    '/receipt',
  ],
  
  PROTECTED_ROUTE_PATTERNS,
  
  SENSITIVE_ROUTES: [
    '/dashboard/users',
    '/dashboard/payments',
    '/dashboard/volunteer-management',
    '/dashboard/referrals',
  ],
  
  XSS_PATTERNS: [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
    /onload=/i,
    /<iframe/i,
    /eval\(/i,
  ],
  
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
  ],
  
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: false,
  PASSWORD_REQUIRE_LOWERCASE: false,
  PASSWORD_REQUIRE_NUMBER: false,
  PASSWORD_REQUIRE_SPECIAL: false,
} as const;


export function isPublicRoute(pathname: string): boolean {
  return SECURITY_CONFIG.PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

export function isProtectedRoute(pathname: string): boolean {
  return SECURITY_CONFIG.PROTECTED_ROUTE_PATTERNS.some(
    pattern => pathname.startsWith(pattern)
  );
}

export function isSensitiveRoute(pathname: string): boolean {
  return SECURITY_CONFIG.SENSITIVE_ROUTES.some(
    route => pathname.startsWith(route)
  );
}

export function getProtectedRouteMatchers(): string[] {
  return Array.from(PROTECTED_ROUTE_MATCHERS);
}

export function containsXSSPattern(input: string): boolean {
  return SECURITY_CONFIG.XSS_PATTERNS.some(pattern => pattern.test(input));
}

export function isAllowedFileType(mimeType: string): boolean {
  return (SECURITY_CONFIG.ALLOWED_FILE_TYPES as readonly string[]).includes(mimeType);
}


export function isValidFileSize(sizeInBytes: number): boolean {
  const maxSizeBytes = SECURITY_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
}
