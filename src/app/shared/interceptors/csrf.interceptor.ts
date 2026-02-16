import { HttpInterceptorFn } from '@angular/common/http';

/**
 * CSRF Interceptor (Functional)
 * 
 * Implements Cross-Site Request Forgery (CSRF) protection by adding
 * a CSRF token to all state-changing HTTP requests (POST, PUT, DELETE, PATCH).
 */
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
    // Only add CSRF token to state-changing requests
    const statefulMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

    if (statefulMethods.includes(req.method) && isSameOrigin(req.url)) {
        const csrfToken = getCsrfTokenFromCookie();

        if (csrfToken) {
            // Clone the request and add the CSRF token header
            req = req.clone({
                setHeaders: {
                    'X-XSRF-TOKEN': csrfToken
                }
            });
        }
    }

    return next(req);
};

/**
 * Check if URL is same-origin
 */
function isSameOrigin(url: string): boolean {
    // Relative URLs are same-origin
    if (!url.startsWith('http')) {
        return true;
    }

    try {
        const requestUrl = new URL(url);
        const currentUrl = new URL(window.location.href);

        return requestUrl.origin === currentUrl.origin;
    } catch {
        return false;
    }
}

/**
 * Get CSRF token from cookie
 */
function getCsrfTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');

        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }

    return null;
}
