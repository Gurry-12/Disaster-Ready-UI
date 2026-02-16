/**
 * Security Headers Configuration
 * 
 * This file defines security headers that should be implemented
 * in your web server configuration (nginx, Apache, etc.) or
 * via Angular's server-side rendering if applicable.
 */

export const SECURITY_HEADERS = {
    /**
     * Content Security Policy (CSP)
     * Prevents XSS attacks by controlling which resources can be loaded
     */
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://maps.googleapis.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; '),

    /**
     * X-Frame-Options
     * Prevents clickjacking attacks
     */
    'X-Frame-Options': 'DENY',

    /**
     * X-Content-Type-Options
     * Prevents MIME type sniffing
     */
    'X-Content-Type-Options': 'nosniff',

    /**
     * Strict-Transport-Security (HSTS)
     * Forces HTTPS connections
     */
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    /**
     * Referrer-Policy
     * Controls referrer information
     */
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    /**
     * Permissions-Policy
     * Controls browser features and APIs
     */
    'Permissions-Policy': [
        'geolocation=(self)',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()'
    ].join(', '),

    /**
     * X-XSS-Protection
     * Legacy XSS protection (for older browsers)
     */
    'X-XSS-Protection': '1; mode=block',

    /**
     * X-Permitted-Cross-Domain-Policies
     * Restricts cross-domain policy files
     */
    'X-Permitted-Cross-Domain-Policies': 'none'
};

/**
 * Nginx Configuration Example
 * 
 * Add these headers to your nginx configuration:
 * 
 * server {
 *   listen 443 ssl http2;
 *   server_name your-domain.com;
 * 
 *   # Security Headers
 *   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://maps.googleapis.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
 *   add_header X-Frame-Options "DENY" always;
 *   add_header X-Content-Type-Options "nosniff" always;
 *   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
 *   add_header Referrer-Policy "strict-origin-when-cross-origin" always;
 *   add_header Permissions-Policy "geolocation=(self), microphone=(), camera=(), payment=(), usb=(), magnetometer=()" always;
 *   add_header X-XSS-Protection "1; mode=block" always;
 *   add_header X-Permitted-Cross-Domain-Policies "none" always;
 * 
 *   # SSL Configuration
 *   ssl_certificate /path/to/cert.pem;
 *   ssl_certificate_key /path/to/key.pem;
 *   ssl_protocols TLSv1.2 TLSv1.3;
 *   ssl_ciphers HIGH:!aNULL:!MD5;
 *   ssl_prefer_server_ciphers on;
 * 
 *   # Application
 *   root /var/www/disaster-ready-ui/dist;
 *   index index.html;
 * 
 *   location / {
 *     try_files $uri $uri/ /index.html;
 *   }
 * }
 * 
 * # Redirect HTTP to HTTPS
 * server {
 *   listen 80;
 *   server_name your-domain.com;
 *   return 301 https://$server_name$request_uri;
 * }
 */

/**
 * Apache Configuration Example
 * 
 * Add these headers to your .htaccess or Apache configuration:
 * 
 * <IfModule mod_headers.c>
 *   Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://maps.googleapis.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
 *   Header always set X-Frame-Options "DENY"
 *   Header always set X-Content-Type-Options "nosniff"
 *   Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
 *   Header always set Referrer-Policy "strict-origin-when-cross-origin"
 *   Header always set Permissions-Policy "geolocation=(self), microphone=(), camera=(), payment=(), usb=(), magnetometer=()"
 *   Header always set X-XSS-Protection "1; mode=block"
 *   Header always set X-Permitted-Cross-Domain-Policies "none"
 * </IfModule>
 * 
 * # Force HTTPS
 * <IfModule mod_rewrite.c>
 *   RewriteEngine On
 *   RewriteCond %{HTTPS} off
 *   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
 * </IfModule>
 */

/**
 * For development testing, you can add meta tags to index.html:
 * 
 * <meta http-equiv="Content-Security-Policy" content="default-src 'self'; ...">
 * <meta http-equiv="X-Frame-Options" content="DENY">
 * 
 * However, HTTP headers are preferred over meta tags for production.
 */
