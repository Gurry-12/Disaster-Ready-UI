# 🔐 Aegis Command Security Documentation

## Overview

This document provides comprehensive security information for the Aegis Command application. It covers implemented security measures, best practices, and guidelines for maintaining a mission-critical, secure tactical interface.

---

## 🛡️ Security Features Implemented

### 1. Authentication & Authorization

#### Tactical Token Management (JWT)
- **Proper Token Validation**: Tokens are validated with expiration checking
- **Secure Token Storage**: Guidance provided for httpOnly cookies (currently using localStorage for demo)
- **Token Refresh**: Automatic token refresh mechanism implemented
- **Session Management**: Auth state managed via RxJS observables

#### Security Improvements
```typescript
// Token validation with expiration checking
isTokenValid(): boolean {
  // Decodes JWT and checks expiration timestamp
  // Automatically clears auth state if token is expired
}
```

### 2. Input Validation & Sanitization

#### Validation Utilities
Located in: `src/app/shared/utils/validation.utils.ts`

Features:
- Email format validation (RFC 5322 compliant)
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- XSS sanitization
- Phone number validation
- URL validation
- Form validators for login, signup, password change

#### Usage Example
```typescript
import { ValidationUtils, FormValidator } from '@shared/utils/validation.utils';

// Validate email
if (!ValidationUtils.isValidEmail(email)) {
  // Handle invalid email
}

// Check password strength
const strength = ValidationUtils.getPasswordStrength(password);
// Returns 0-4 (Very Weak to Strong)

// Sanitize user input
const safe = ValidationUtils.sanitizeString(userInput);
```

### 3. Secure Tactical Logging

#### Logger Service
Located in: `src/app/shared/services/logger.service.ts`

Features:
- Environment-aware logging (dev vs production)
- Automatic sensitive data sanitization
- Security event logging
- Performance tracking
- Integration hooks for error tracking services

#### Usage Example
```typescript
import { LoggerService } from '@shared/services/logger.service';

constructor(private logger: LoggerService) {}

// Safe logging (auto-sanitizes sensitive data)
this.logger.info('User action completed');
this.logger.error('Operation failed', error);
this.logger.logAuthEvent('Login successful', userId);
this.logger.logSecurityEvent('Failed login attempt', details);
```

### 4. CSRF Protection

#### CSRF Interceptor
Located in: `src/app/shared/interceptors/csrf.interceptor.ts`

Implements Double Submit Cookie pattern:
1. Server sets CSRF token in cookie
2. Client reads cookie and sends as header
3. Server validates header matches cookie

#### Configuration
```typescript
// Add to app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CsrfInterceptor } from './shared/interceptors/csrf.interceptor';

providers: [
  provideHttpClient(
    withInterceptors([csrfInterceptor])
  )
]
```

### 5. Security Headers

#### Configuration File
Located in: `src/app/shared/config/security-headers.config.ts`

Recommended headers:
- **Content-Security-Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **Strict-Transport-Security**: Enforces HTTPS
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information

#### Implementation
Headers should be configured on your web server (nginx, Apache) or CDN.

Example nginx configuration:
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline';" always;
add_header X-Frame-Options "DENY" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## 🔑 Environment Variables

### Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your actual values:
```env
GOOGLE_MAPS_API_KEY=your_actual_api_key
JWT_SECRET=your_strong_random_secret
API_URL=https://api.aegis-command.gov/api
```

3. **NEVER commit `.env` to version control!**

---

## � Tactical Best Practices

### For Deployment
1. **Configure security headers**: Implement CSP, HSTS, X-Frame-Options.
2. **Enable HTTPS**: Use valid SSL certificates and redirect all traffic.
3. **Implement rate limiting**: Protect authentication endpoints.
4. **Set up monitoring**: Monitor failed login attempts and anomaly patterns.

---

## 📞 Tactical Incident Response

### If you discover a security vulnerability:

1. **Do NOT disclose publicly**
2. **Email security team immediately**: security@aegis-command.gov
3. **Provide detailed information**:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

**Last Updated:** February 16, 2026  
**Next Review:** May 16, 2026

---

## 📧 Contact

For security concerns, contact:
- **Security Team**: security@aegis-command.gov
- **Emergency**: Request Aegis Command Tactical Lead
