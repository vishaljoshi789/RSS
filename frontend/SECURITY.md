# 🔒 Security Implementation Guides

## Overview
This application implements multiple layers of security to protect user data and prevent unauthorized access.

## Security Features

### 1. **Middleware Security** (`src/middleware.ts`)

#### Features Implemented:
- ✅ **Authentication Check**: Validates JWT tokens for protected routes
- ✅ **Security Headers**: Prevents clickjacking, XSS, and other attacks
- ✅ **CORS Protection**: Validates request origins
- ✅ **Rate Limiting**: Prevents redirect loops (max 3 attempts)
- ✅ **XSS Prevention**: Sanitizes URL parameters
- ✅ **Audit Logging**: Logs access to sensitive routes
- ✅ **Auto Redirect**: Prevents logged-in users from accessing auth pages

### 2. **Role-Based Access Control (RBAC)**

#### Three-Layer Protection:
1. **Middleware** - Token validation
2. **RoleGuard Component** - Client-side role checking
3. **Backend API** - Server-side permission validation

#### How It Works:
```typescript
// User tries to access /dashboard/users
// ↓
// 1. Middleware checks if user has access_token
// 2. RoleGuard checks if user has 'admin' or 'staff' role
// 3. Backend API validates permissions again
```

### 3. **Centralized Configuration** (`src/lib/security-config.ts`)

All security settings in one place:

```typescript
SECURITY_CONFIG = {
  MAX_REDIRECT_ATTEMPTS: 3,
  ALLOWED_ORIGINS: [...],
  PUBLIC_ROUTES: [...],
  SENSITIVE_ROUTES: [...],
  XSS_PATTERNS: [...],
  SECURITY_HEADERS: {...},
}
```

## Security Headers Explained

| Header | Purpose | Value |
|--------|---------|-------|
| `X-Frame-Options` | Prevents clickjacking | `DENY` |
| `X-Content-Type-Options` | Prevents MIME sniffing | `nosniff` |
| `X-XSS-Protection` | Enables browser XSS filter | `1; mode=block` |
| `Referrer-Policy` | Controls referrer info | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables unnecessary features | `camera=(), microphone=()` |

## Protected Routes

### Authentication Required:
- `/dashboard/*` - All dashboard routes

### Role-Based Access:
- `/dashboard/users` → Admin, Staff only
- `/dashboard/payments` → Admin, Staff only
- `/dashboard/volunteer-management` → Admin, Staff only
- `/dashboard/referrals` → Admin, Staff only
- `/dashboard/id-card-management` → Member, Volunteer
- `/dashboard/volunteer-registration` → Volunteer, Member

## How to Add/Modify Security Rules

### 1. Change Allowed Origins
```typescript
// src/lib/security-config.ts
ALLOWED_ORIGINS: [
  'https://your-production-domain.com', // Add here
  'http://localhost:3000',
]
```

### 2. Add Public Routes
```typescript
// src/lib/security-config.ts
PUBLIC_ROUTES: [
  '/',
  '/new-public-page', // Add here
]
```

### 3. Add Sensitive Routes (for audit logging)
```typescript
// src/lib/security-config.ts
SENSITIVE_ROUTES: [
  '/dashboard/users',
  '/dashboard/new-sensitive-page', // Add here
]
```

### 4. Modify Role Access
```typescript
// src/lib/route-access.ts
{
  path: "/dashboard/users",
  allowedRoles: ["admin", "staff", "new_role"], // Add role here
}
```

## Security Best Practices

### ✅ DO:
- Always use `allowedRoles="auto"` in RoleGuard
- Update `route-access.ts` for access control
- Keep security config centralized
- Test role changes before deployment
- Monitor audit logs for suspicious activity

### ❌ DON'T:
- Don't hardcode roles in individual pages
- Don't store sensitive data in localStorage
- Don't disable security headers
- Don't bypass RoleGuard for quick fixes
- Don't commit sensitive credentials

## Testing Security

### Test Authentication:
1. Try accessing `/dashboard/users` without login
2. Should redirect to `/auth/login?redirect=/dashboard/users`

### Test Role-Based Access:
1. Login as a regular member
2. Try accessing `/dashboard/users` directly
3. Should show "Access Denied" message

### Test XSS Prevention:
1. Try URL: `/dashboard?test=<script>alert('xss')</script>`
2. Should be redirected to clean URL

## Security Checklist for Production

- [ ] Update `ALLOWED_ORIGINS` with production domain
- [ ] Enable HTTPS in production
- [ ] Set `secure: true` for cookies
- [ ] Enable Content Security Policy (CSP)
- [ ] Set up rate limiting on backend
- [ ] Enable audit logging to external service
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable 2FA for admin accounts

## Emergency Security Response

If a security issue is discovered:

1. **Immediate**: Revoke all active sessions
2. **Update**: Patch the vulnerability
3. **Audit**: Check logs for suspicious activity
4. **Notify**: Inform affected users
5. **Review**: Conduct security review

## Contact

For security concerns or vulnerabilities, contact:
- Email: security@your-domain.com
- Create a private issue on GitHub

---

**Last Updated**: November 6, 2025
**Version**: 1.0.0
