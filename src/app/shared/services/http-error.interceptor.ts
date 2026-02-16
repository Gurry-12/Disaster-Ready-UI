import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';

/**
 * HTTP Error Interceptor
 * 
 * Centralized error handling for all HTTP requests.
 * Logs errors securely and provides user-friendly error messages.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private logger: LoggerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Log the error securely (sensitive data will be sanitized)
                this.logger.error(`HTTP Error: ${request.method} ${request.url}`, error);

                // Log security events for specific error codes
                if (error.status === 401) {
                    this.logger.logSecurityEvent('Unauthorized access attempt', {
                        url: request.url,
                        method: request.method
                    });
                } else if (error.status === 403) {
                    this.logger.logSecurityEvent('Forbidden access attempt', {
                        url: request.url,
                        method: request.method
                    });
                } else if (error.status === 429) {
                    this.logger.logSecurityEvent('Rate limit exceeded', {
                        url: request.url,
                        method: request.method
                    });
                }

                // Return user-friendly error message
                const userMessage = this.getUserFriendlyMessage(error);

                return throwError(() => ({
                    message: userMessage,
                    status: error.status,
                    statusText: error.statusText,
                    originalError: error
                }));
            })
        );
    }

    /**
     * Get user-friendly error message based on HTTP status code
     */
    private getUserFriendlyMessage(error: HttpErrorResponse): string {
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
}
