import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Secure Logging Service
 * 
 * Provides environment-aware logging that prevents sensitive data
 * from being exposed in production environments.
 */
@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    private readonly isDevelopment = !environment.production;
    private readonly sensitiveFields = [
        'password',
        'token',
        'accessToken',
        'refreshToken',
        'apiKey',
        'secret',
        'creditCard',
        'ssn',
        'authorization'
    ];

    /**
     * Log informational messages
     * Only logs in development mode
     */
    info(message: string, ...optionalParams: any[]): void {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, ...this.sanitizeParams(optionalParams));
        }
    }

    /**
     * Log warning messages
     * Logs in all environments but sanitizes sensitive data
     */
    warn(message: string, ...optionalParams: any[]): void {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, ...this.sanitizeParams(optionalParams));
        }
    }

    /**
     * Log error messages
     * Logs in all environments but sanitizes sensitive data
     */
    error(message: string, error?: any): void {
        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, error);
        } else {
            // In production, log sanitized error ONLY to tracking service
            const sanitizedError = this.sanitizeError(error);
            // No console.error here for production-ready silence

            // Send to error tracking service (e.g., Sentry, LogRocket)
            this.sendToErrorTracking(message, sanitizedError);
        }
    }

    /**
     * Log debug messages
     * Only logs in development mode
     */
    debug(message: string, ...optionalParams: any[]): void {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, ...this.sanitizeParams(optionalParams));
        }
    }

    /**
     * Log HTTP requests
     * Only logs in development mode
     */
    logRequest(method: string, url: string, body?: any): void {
        // Silent even in development as per user request to remove XHR noise
    }

    /**
     * Log HTTP responses
     * Only logs in development mode
     */
    logResponse(method: string, url: string, status: number, body?: any): void {
        // Silent even in development as per user request to remove XHR noise
    }

    /**
     * Log authentication events
     * Logs in all environments but never logs credentials to console in production
     */
    logAuthEvent(event: string, userId?: string | number): void {
        const sanitizedUserId = userId ? `User ${userId}` : 'Unknown user';

        if (this.isDevelopment) {
            console.log(`[AUTH] ${event} - ${sanitizedUserId}`);
        }

        // Always send to audit log service (even in production)
        this.sendToAuditLog(event, sanitizedUserId);
    }

    /**
     * Log security events
     * Always logs security events for monitoring, but silent in production console
     */
    logSecurityEvent(event: string, details?: any): void {
        const sanitizedDetails = this.sanitizeObject(details);

        if (this.isDevelopment) {
            console.warn(`[SECURITY] ${event}`, sanitizedDetails);
        }

        // Always send to security monitoring service (even in production)
        this.sendToSecurityMonitoring(event, sanitizedDetails);
    }

    /**
     * Sanitize parameters to remove sensitive data
     */
    private sanitizeParams(params: any[]): any[] {
        return params.map(param => this.sanitizeObject(param));
    }

    /**
     * Sanitize object to remove sensitive fields
     */
    private sanitizeObject(obj: any): any {
        if (!obj) return obj;

        if (typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }

        const sanitized: any = {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Check if field name contains sensitive keywords
                const isSensitive = this.sensitiveFields.some(field =>
                    key.toLowerCase().includes(field.toLowerCase())
                );

                if (isSensitive) {
                    sanitized[key] = '[REDACTED]';
                } else if (typeof obj[key] === 'object') {
                    sanitized[key] = this.sanitizeObject(obj[key]);
                } else {
                    sanitized[key] = obj[key];
                }
            }
        }

        return sanitized;
    }

    /**
     * Sanitize error object
     */
    private sanitizeError(error: any): any {
        if (!error) return null;

        return {
            message: error.message || 'An error occurred',
            status: error.status,
            statusText: error.statusText,
            name: error.name,
            // Don't include stack trace in production
            ...(this.isDevelopment && { stack: error.stack })
        };
    }

    /**
     * Send error to tracking service
     * TODO: Implement integration with error tracking service
     */
    private sendToErrorTracking(message: string, error: any): void {
        // Example: Sentry.captureException(error);
        // Example: LogRocket.captureException(error);

        if (this.isDevelopment) {
            console.log('[ERROR TRACKING] Would send to error tracking service:', { message, error });
        }
    }

    /**
     * Send to audit log service
     * TODO: Implement integration with audit logging service
     */
    private sendToAuditLog(event: string, userId: string): void {
        // Example: Send to backend audit log API

        if (this.isDevelopment) {
            console.log('[AUDIT LOG] Would send to audit service:', { event, userId, timestamp: new Date() });
        }
    }

    /**
     * Send to security monitoring service
     * TODO: Implement integration with security monitoring service
     */
    private sendToSecurityMonitoring(event: string, details: any): void {
        // Example: Send to SIEM or security monitoring platform

        if (this.isDevelopment) {
            console.log('[SECURITY MONITORING] Would send to security service:', { event, details, timestamp: new Date() });
        }
    }

    /**
     * Performance logging
     * Track performance metrics in development
     */
    logPerformance(label: string, startTime: number): void {
        if (this.isDevelopment) {
            const duration = performance.now() - startTime;
            console.log(`[PERFORMANCE] ${label}: ${duration.toFixed(2)}ms`);
        }
    }

    /**
     * Start performance measurement
     */
    startPerformanceMeasure(label: string): number {
        return performance.now();
    }
}

/**
 * Usage Examples:
 * 
 * constructor(private logger: LoggerService) {}
 * 
 * // Info logging (dev only)
 * this.logger.info('User navigated to dashboard');
 * 
 * // Error logging (sanitized in production)
 * this.logger.error('Failed to load data', error);
 * 
 * // Auth events (always logged)
 * this.logger.logAuthEvent('Login successful', user.id);
 * 
 * // Security events (always logged)
 * this.logger.logSecurityEvent('Failed login attempt', { email: user.email });
 * 
 * // Performance tracking
 * const start = this.logger.startPerformanceMeasure('data-load');
 * // ... do work ...
 * this.logger.logPerformance('data-load', start);
 * 
 * // HTTP logging (dev only)
 * this.logger.logRequest('POST', '/api/users', userData);
 * this.logger.logResponse('POST', '/api/users', 201, response);
 */
