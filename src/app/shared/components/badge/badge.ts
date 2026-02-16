import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './badge.html',
    styleUrls: ['./badge.css']
})
export class BadgeComponent {
    @Input() label = '';
    @Input() type: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';
    @Input() variant: 'solid' | 'outline' | 'soft' = 'solid';
    @Input() icon = '';
}
