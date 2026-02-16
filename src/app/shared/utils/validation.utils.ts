/**
 * Input Validation Utilities
 * Provides secure input validation and sanitization functions
 */

export class ValidationUtils {

    /**
     * Email validation regex pattern
     * RFC 5322 compliant email validation
     */
    private static readonly EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    /**
     * Password validation requirements:
     * - Minimum 8 characters
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * - At least one special character
     */
    private static readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean {
        if (!email || typeof email !== 'string') return false;
        return this.EMAIL_PATTERN.test(email.trim());
    }

    /**
     * Validate password strength
     */
    static isValidPassword(password: string): boolean {
        if (!password || typeof password !== 'string') return false;
        return this.PASSWORD_PATTERN.test(password);
    }

    /**
     * Get password strength score (0-4)
     * 0 = Very Weak, 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
     */
    static getPasswordStrength(password: string): number {
        if (!password) return 0;

        let strength = 0;

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Character variety checks
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;

        return Math.min(strength, 4);
    }

    /**
     * Get password strength label
     */
    static getPasswordStrengthLabel(password: string): string {
        const strength = this.getPasswordStrength(password);
        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return labels[strength];
    }

    /**
     * Sanitize string input to prevent XSS
     * Removes potentially dangerous characters
     */
    static sanitizeString(input: string): string {
        if (!input || typeof input !== 'string') return '';

        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Validate phone number (international format)
     */
    static isValidPhone(phone: string): boolean {
        if (!phone || typeof phone !== 'string') return false;
        // Allows: +1234567890, (123) 456-7890, 123-456-7890, etc.
        const phonePattern = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return phonePattern.test(phone.trim());
    }

    /**
     * Validate URL format
     */
    static isValidUrl(url: string): boolean {
        if (!url || typeof url !== 'string') return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate required field
     */
    static isRequired(value: any): boolean {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        return true;
    }

    /**
     * Validate minimum length
     */
    static minLength(value: string, min: number): boolean {
        if (!value || typeof value !== 'string') return false;
        return value.trim().length >= min;
    }

    /**
     * Validate maximum length
     */
    static maxLength(value: string, max: number): boolean {
        if (!value || typeof value !== 'string') return true;
        return value.trim().length <= max;
    }

    /**
     * Validate that two values match (e.g., password confirmation)
     */
    static matches(value1: any, value2: any): boolean {
        return value1 === value2;
    }

    /**
     * Validate alphanumeric only
     */
    static isAlphanumeric(value: string): boolean {
        if (!value || typeof value !== 'string') return false;
        return /^[a-zA-Z0-9]+$/.test(value);
    }

    /**
     * Validate numeric only
     */
    static isNumeric(value: string): boolean {
        if (!value || typeof value !== 'string') return false;
        return /^\d+$/.test(value);
    }

    /**
     * Get validation error message
     */
    static getErrorMessage(field: string, validationType: string, params?: any): string {
        const messages: { [key: string]: string } = {
            required: `${field} is required`,
            email: `Please enter a valid email address`,
            password: `Password must be at least 8 characters with uppercase, lowercase, number, and special character`,
            minLength: `${field} must be at least ${params?.min} characters`,
            maxLength: `${field} must not exceed ${params?.max} characters`,
            matches: `${field} does not match`,
            phone: `Please enter a valid phone number`,
            url: `Please enter a valid URL`,
            alphanumeric: `${field} must contain only letters and numbers`,
            numeric: `${field} must contain only numbers`
        };

        return messages[validationType] || `Invalid ${field}`;
    }
}

/**
 * Form validation helper
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export class FormValidator {

    /**
     * Validate login form
     */
    static validateLoginForm(email: string, password: string): ValidationResult {
        const errors: string[] = [];

        if (!ValidationUtils.isRequired(email)) {
            errors.push(ValidationUtils.getErrorMessage('Email', 'required'));
        } else if (!ValidationUtils.isValidEmail(email)) {
            errors.push(ValidationUtils.getErrorMessage('Email', 'email'));
        }

        if (!ValidationUtils.isRequired(password)) {
            errors.push(ValidationUtils.getErrorMessage('Password', 'required'));
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate signup form
     */
    static validateSignupForm(
        name: string,
        email: string,
        password: string,
        confirmPassword: string,
        termsAccepted: boolean
    ): ValidationResult {
        const errors: string[] = [];

        if (!ValidationUtils.isRequired(name)) {
            errors.push(ValidationUtils.getErrorMessage('Name', 'required'));
        } else if (!ValidationUtils.minLength(name, 2)) {
            errors.push(ValidationUtils.getErrorMessage('Name', 'minLength', { min: 2 }));
        }

        if (!ValidationUtils.isRequired(email)) {
            errors.push(ValidationUtils.getErrorMessage('Email', 'required'));
        } else if (!ValidationUtils.isValidEmail(email)) {
            errors.push(ValidationUtils.getErrorMessage('Email', 'email'));
        }

        if (!ValidationUtils.isRequired(password)) {
            errors.push(ValidationUtils.getErrorMessage('Password', 'required'));
        } else if (!ValidationUtils.isValidPassword(password)) {
            errors.push(ValidationUtils.getErrorMessage('Password', 'password'));
        }

        if (!ValidationUtils.matches(password, confirmPassword)) {
            errors.push(ValidationUtils.getErrorMessage('Passwords', 'matches'));
        }

        if (!termsAccepted) {
            errors.push('You must accept the terms and conditions');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate password change form
     */
    static validatePasswordChangeForm(
        currentPassword: string,
        newPassword: string,
        confirmPassword: string
    ): ValidationResult {
        const errors: string[] = [];

        if (!ValidationUtils.isRequired(currentPassword)) {
            errors.push(ValidationUtils.getErrorMessage('Current password', 'required'));
        }

        if (!ValidationUtils.isRequired(newPassword)) {
            errors.push(ValidationUtils.getErrorMessage('New password', 'required'));
        } else if (!ValidationUtils.isValidPassword(newPassword)) {
            errors.push(ValidationUtils.getErrorMessage('New password', 'password'));
        }

        if (!ValidationUtils.matches(newPassword, confirmPassword)) {
            errors.push(ValidationUtils.getErrorMessage('Passwords', 'matches'));
        }

        if (currentPassword === newPassword) {
            errors.push('New password must be different from current password');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
