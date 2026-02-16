import { Directive, ElementRef, HostListener, Renderer2, Input, OnInit } from '@angular/core';
import { ValidationUtils } from '../utils/validation.utils';

/**
 * Password Strength Directive
 * 
 * Adds visual feedback for password strength as user types.
 * Displays strength indicator and requirements.
 */
@Directive({
    selector: '[appPasswordStrength]',
    standalone: true
})
export class PasswordStrengthDirective implements OnInit {

    @Input() showRequirements = true;

    private strengthIndicator: HTMLElement | null = null;
    private requirementsList: HTMLElement | null = null;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        if (this.showRequirements) {
            this.createStrengthIndicator();
            this.createRequirementsList();
        }
    }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const password = (event.target as HTMLInputElement).value;
        this.updateStrengthIndicator(password);
        if (this.showRequirements) {
            this.updateRequirements(password);
        }
    }

    /**
     * Create strength indicator element
     */
    private createStrengthIndicator(): void {
        const container = this.renderer.createElement('div');
        this.renderer.addClass(container, 'password-strength-indicator');

        const label = this.renderer.createElement('span');
        this.renderer.addClass(label, 'strength-label');
        this.renderer.appendChild(container, label);

        const bar = this.renderer.createElement('div');
        this.renderer.addClass(bar, 'strength-bar');
        this.renderer.appendChild(container, bar);

        this.strengthIndicator = container;

        // Insert after the input element
        const parent = this.el.nativeElement.parentNode;
        this.renderer.insertBefore(parent, container, this.el.nativeElement.nextSibling);
    }

    /**
     * Create requirements list
     */
    private createRequirementsList(): void {
        const list = this.renderer.createElement('ul');
        this.renderer.addClass(list, 'password-requirements');

        const requirements = [
            { id: 'length', text: 'At least 8 characters' },
            { id: 'uppercase', text: 'One uppercase letter' },
            { id: 'lowercase', text: 'One lowercase letter' },
            { id: 'number', text: 'One number' },
            { id: 'special', text: 'One special character (@$!%*?&)' }
        ];

        requirements.forEach(req => {
            const item = this.renderer.createElement('li');
            this.renderer.setAttribute(item, 'data-requirement', req.id);
            this.renderer.addClass(item, 'requirement-item');

            const icon = this.renderer.createElement('span');
            this.renderer.addClass(icon, 'requirement-icon');
            this.renderer.appendChild(item, icon);

            const text = this.renderer.createText(req.text);
            this.renderer.appendChild(item, text);

            this.renderer.appendChild(list, item);
        });

        this.requirementsList = list;

        // Insert after strength indicator
        const parent = this.el.nativeElement.parentNode;
        const insertAfter = this.strengthIndicator || this.el.nativeElement;
        this.renderer.insertBefore(parent, list, insertAfter.nextSibling);
    }

    /**
     * Update strength indicator
     */
    private updateStrengthIndicator(password: string): void {
        if (!this.strengthIndicator) return;

        const strength = ValidationUtils.getPasswordStrength(password);
        const label = ValidationUtils.getPasswordStrengthLabel(password);

        const labelEl = this.strengthIndicator.querySelector('.strength-label');
        const barEl = this.strengthIndicator.querySelector('.strength-bar');

        if (labelEl && barEl) {
            this.renderer.setProperty(labelEl, 'textContent', `Strength: ${label}`);

            // Remove all strength classes
            ['very-weak', 'weak', 'fair', 'good', 'strong'].forEach(cls => {
                this.renderer.removeClass(barEl, cls);
            });

            // Add current strength class
            const strengthClass = label.toLowerCase().replace(' ', '-');
            this.renderer.addClass(barEl, strengthClass);

            // Set width based on strength
            const width = (strength / 4) * 100;
            this.renderer.setStyle(barEl, 'width', `${width}%`);
        }
    }

    /**
     * Update requirements checklist
     */
    private updateRequirements(password: string): void {
        if (!this.requirementsList) return;

        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        Object.entries(checks).forEach(([id, met]) => {
            const item = this.requirementsList!.querySelector(`[data-requirement="${id}"]`);
            if (item) {
                if (met) {
                    this.renderer.addClass(item, 'met');
                    this.renderer.removeClass(item, 'unmet');
                } else {
                    this.renderer.addClass(item, 'unmet');
                    this.renderer.removeClass(item, 'met');
                }
            }
        });
    }
}

/**
 * CSS Styles (add to your global styles or component styles):
 * 
 * .password-strength-indicator {
 *   margin-top: 8px;
 * }
 * 
 * .strength-label {
 *   font-size: 12px;
 *   font-weight: 600;
 *   display: block;
 *   margin-bottom: 4px;
 * }
 * 
 * .strength-bar {
 *   height: 4px;
 *   border-radius: 2px;
 *   transition: all 0.3s ease;
 * }
 * 
 * .strength-bar.very-weak { background: #dc3545; }
 * .strength-bar.weak { background: #fd7e14; }
 * .strength-bar.fair { background: #ffc107; }
 * .strength-bar.good { background: #20c997; }
 * .strength-bar.strong { background: #28a745; }
 * 
 * .password-requirements {
 *   list-style: none;
 *   padding: 8px 0;
 *   margin: 8px 0;
 *   font-size: 12px;
 * }
 * 
 * .requirement-item {
 *   padding: 4px 0;
 *   color: #6c757d;
 * }
 * 
 * .requirement-item.met {
 *   color: #28a745;
 * }
 * 
 * .requirement-item.met .requirement-icon::before {
 *   content: '✓ ';
 *   font-weight: bold;
 * }
 * 
 * .requirement-item.unmet .requirement-icon::before {
 *   content: '○ ';
 * }
 * 
 * Usage:
 * <input type="password" appPasswordStrength [showRequirements]="true" />
 */
