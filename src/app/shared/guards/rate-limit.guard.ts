import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoggerService } from '../services/logger.service';

/**
 * Rate Limit Guard
 * 
 * Client-side rate limiting to prevent abuse.
 * This is a basic implementation - server-side rate limiting is still required!
 */
@Injectable({
    providedIn: 'root'
})
export class RateLimitGuard implements CanActivate {

    private attemptCounts = new Map<string, { count: number; resetTime: number }>();
    private readonly MAX_ATTEMPTS = 5;
    private readonly WINDOW_MS = 60000; // 1 minute

    constructor(
        private router: Router,
        private logger: LoggerService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        const key = this.getKey(state.url);
        const now = Date.now();

        // Get or create attempt record
        let record = this.attemptCounts.get(key);

        // Reset if window has passed
        if (!record || now > record.resetTime) {
            record = {
                count: 0,
                resetTime: now + this.WINDOW_MS
            };
        }

        // Increment attempt count
        record.count++;
        this.attemptCounts.set(key, record);

        // Check if rate limit exceeded
        if (record.count > this.MAX_ATTEMPTS) {
            this.logger.logSecurityEvent('Rate limit exceeded (client-side)', {
                url: state.url,
                attempts: record.count
            });

            // Redirect to rate limit page or show error
            this.router.navigate(['/rate-limit-exceeded']);
            return of(false);
        }

        return of(true);
    }

    /**
     * Generate key for rate limiting
     * In production, you might want to include IP address or user ID
     */
    private getKey(url: string): string {
        return `rate-limit:${url}`;
    }

    /**
     * Reset rate limit for a specific key
     */
    resetLimit(url: string): void {
        const key = this.getKey(url);
        this.attemptCounts.delete(key);
    }

    /**
     * Clear all rate limit records
     */
    clearAll(): void {
        this.attemptCounts.clear();
    }
}

/**
 * Usage in routes:
 * 
 * {
 *   path: 'login',
 *   component: LoginComponent,
 *   canActivate: [RateLimitGuard]
 * }
 * 
 * Note: This is client-side rate limiting only.
 * ALWAYS implement server-side rate limiting as well!
 */
