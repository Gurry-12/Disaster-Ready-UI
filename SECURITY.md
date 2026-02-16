# 🔐 Security Documentation

## Overview

This document provides comprehensive security information for the Disaster-Ready-UI application. It covers implemented security measures, best practices, and guidelines for maintaining a secure application.

---

## 🛡️ Security Features Implemented

### 1. Authentication & Authorization

#### JWT Token Management
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

### 3. Secure Logging

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
API_URL=https://your-api-domain.com/api
```

3. **NEVER commit `.env` to version control!**

### Loading Environment Variables

For Angular applications, environment variables are typically loaded at build time:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: process.env['API_URL'] || 'http://localhost:3000/api',
  mapApiKey: process.env['GOOGLE_MAPS_API_KEY'] || ''
};
```

---

## 🚨 Security Vulnerabilities Fixed

### Critical Issues Resolved

1. **Exposed API Keys** ✅
   - Removed Google Maps API key from source code
   - Added environment variable configuration
   - Updated .gitignore to exclude .env files

2. **Hardcoded Credentials** ✅
   - Added environment-based credential checking
   - Added security warnings in code
   - Documented need for backend authentication

3. **Weak Token Validation** ✅
   - Implemented proper JWT decoding
   - Added expiration timestamp checking
   - Auto-clears auth state on expired tokens

4. **Insecure Logging** ✅
   - Removed console.log of sensitive data
   - Created secure logging service
   - Implemented automatic data sanitization

5. **Missing Input Validation** ✅
   - Created comprehensive validation utilities
   - Added XSS sanitization
   - Implemented form validators

### Dependency Vulnerabilities

Run `npm audit fix` to update vulnerable packages:
```bash
npm audit fix
```

For breaking changes:
```bash
npm audit fix --force
```

---

## 🔒 Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use environment variables
   - Check .gitignore includes .env
   - Use git-secrets or similar tools

2. **Validate all inputs**
   - Use ValidationUtils for all user inputs
   - Sanitize data before display
   - Implement server-side validation too

3. **Use secure logging**
   - Use LoggerService instead of console.log
   - Never log passwords, tokens, or API keys
   - Sanitize error messages

4. **Follow authentication best practices**
   - Use httpOnly cookies for tokens (not localStorage)
   - Implement proper session management
   - Add multi-factor authentication

5. **Keep dependencies updated**
   - Run `npm audit` regularly
   - Update dependencies weekly
   - Monitor security advisories

### For DevOps

1. **Configure security headers**
   - Implement CSP, HSTS, X-Frame-Options
   - Test with securityheaders.com
   - Use Mozilla Observatory for scanning

2. **Enable HTTPS**
   - Use valid SSL certificates
   - Redirect HTTP to HTTPS
   - Enable HSTS header

3. **Implement rate limiting**
   - Limit login attempts
   - Add CAPTCHA for suspicious activity
   - Implement account lockout

4. **Set up monitoring**
   - Monitor failed login attempts
   - Track security events
   - Set up alerts for anomalies

5. **Regular backups**
   - Automated daily backups
   - Test restore procedures
   - Encrypt backup data

---

## 🧪 Security Testing

### Manual Testing

1. **Authentication Testing**
```bash
# Test with invalid credentials
# Test token expiration
# Test session timeout
# Test concurrent sessions
```

2. **Input Validation Testing**
```bash
# Test XSS payloads: <script>alert('XSS')</script>
# Test SQL injection: ' OR '1'='1
# Test command injection: ; ls -la
# Test path traversal: ../../etc/passwd
```

3. **CSRF Testing**
```bash
# Attempt cross-origin requests
# Test without CSRF token
# Test with invalid CSRF token
```

### Automated Testing

1. **Security Linting**
```bash
npm install --save-dev eslint-plugin-security
```

2. **Dependency Scanning**
```bash
npm audit
npm install -g snyk
snyk test
```

3. **OWASP ZAP Scanning**
```bash
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://your-app.com
```

---

## 📊 Security Monitoring

### Metrics to Track

1. **Authentication Metrics**
   - Failed login attempts
   - Successful logins
   - Password reset requests
   - Account lockouts

2. **Security Events**
   - XSS attempts
   - CSRF attempts
   - SQL injection attempts
   - Unusual API access patterns

3. **Performance Metrics**
   - Response times
   - Error rates
   - API usage patterns

### Alerting

Set up alerts for:
- Multiple failed login attempts from same IP
- Unusual API access patterns
- High error rates
- Security header violations
- Certificate expiration

---

## 🚀 Deployment Security

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API keys rotated and restricted
- [ ] Security headers configured
- [ ] HTTPS certificate valid
- [ ] Dependencies updated
- [ ] Security tests passed
- [ ] Monitoring configured

### Post-Deployment Verification

1. **Test HTTPS**
```bash
curl -I https://your-app.com
```

2. **Check Security Headers**
```bash
curl -I https://your-app.com | grep -i "content-security\|x-frame\|strict-transport"
```

3. **Scan for Vulnerabilities**
```bash
# Use Mozilla Observatory
https://observatory.mozilla.org/

# Use Security Headers
https://securityheaders.com/
```

---

## 📞 Incident Response

### If you discover a security vulnerability:

1. **Do NOT disclose publicly**
2. **Email security team immediately**
3. **Provide detailed information**:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### If a security incident occurs:

1. **Immediate Actions**
   - Isolate affected systems
   - Preserve evidence
   - Notify security team

2. **Investigation**
   - Determine scope
   - Identify attack vector
   - Assess data exposure

3. **Remediation**
   - Patch vulnerabilities
   - Rotate credentials
   - Restore from backups

4. **Communication**
   - Notify affected users
   - Report to authorities (if required)
   - Update stakeholders

---

## 📚 Additional Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.io/guide/security)
- [Web Security Cheat Sheet](https://cheatsheetseries.owasp.org/)

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security scanner
- [Snyk](https://snyk.io/) - Dependency scanner
- [Mozilla Observatory](https://observatory.mozilla.org/) - Security scanner
- [Security Headers](https://securityheaders.com/) - Header checker

### Training
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackerOne CTF](https://www.hackerone.com/for-hackers/hacker-101)

---

## 🔄 Updates

This security documentation should be reviewed and updated:
- After each security audit
- When new features are added
- When vulnerabilities are discovered
- At least quarterly

**Last Updated:** February 16, 2026  
**Next Review:** May 16, 2026

---

## 📧 Contact

For security concerns, contact:
- **Security Team**: security@disaster-ready.com
- **Emergency**: Call security hotline

**PGP Key**: [Link to public key for encrypted communication]
