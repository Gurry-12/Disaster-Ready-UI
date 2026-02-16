import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';

/**
 * HTTP Error Interceptor (Functional)
 * 
 * Centralized error handling for all HTTP requests.
 * Logs errors securely and provides user-friendly error messages.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LoggerService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Log the error securely (sensitive data will be sanitized)
            logger.error(`HTTP Error: ${req.method} ${req.url}`, error);

            // Log security events for specific error codes
            if (error.status === 401) {
                logger.logSecurityEvent('Unauthorized access attempt', {
                    url: req.url,
                    method: req.method
                });
            } else if (error.status === 403) {
                logger.logSecurityEvent('Forbidden access attempt', {
                    url: req.url,
                    method: req.method
                });
            } else if (error.status === 429) {
                logger.logSecurityEvent('Rate limit exceeded', {
                    url: req.url,
                    method: req.method
                });
            }

            // Return user-friendly error message
            const userMessage = getUserFriendlyMessage(error);

            return throwError(() => ({
                message: userMessage,
                status: error.status,
                statusText: error.statusText,
                originalError: error
            }));
        })
    );
};

/**
 * Get user-friendly error message based on HTTP status code
 */
function getUserFriendlyMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 0:
            return 'Unable to connect to the server. Please check your internet connection.';
        case 400:
            return error.error?.message || 'Invalid request. Please check your input.';
        case 401:
            return 'Your session has expired. Please log in again.';
        case 403:
            return 'You do not have permission to access this resource.';
        case 404:
            return 'The requested resource was not found.';
        case 429:
            return 'Too many requests. Please try again later.';
        case 500:
            return 'A server error occurred. Please try again later.';
        case 503:
            return 'Service temporarily unavailable. Please try again later.';
        default:
            return error.error?.message || 'An unexpected error occurred. Please try again.';
    }
}
