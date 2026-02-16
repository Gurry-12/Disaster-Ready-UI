import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './about.html',
    styleUrl: './about.css'
})
export class AboutComponent {
    leadDeveloper = {
        name: 'Gurpreet Singh',
        role: 'Full-Stack Developer',
        bio: 'Specializing in C#, ASP.NET Core, Python, Angular, and AI/ML. Passionate about creating scalable, innovative solutions with modern tech stacks.',
        handle: '@Gurry-12'
    };

    corePillars = [
        {
            title: 'Precision Coordination',
            desc: 'Real-time resource tracking and shelter management with logical allocation algorithms.',
            icon: 'bi-target'
        },
        {
            title: 'Tactical Intelligence',
            desc: 'Live incident heatmapping and impact analysis for faster decision making.',
            icon: 'bi-radar'
        },
        {
            title: 'Resilient Infrastructure',
            desc: 'Built with an offline-first philosophy to ensure operations continue even when connectivity fails.',
            icon: 'bi-shield-shaded'
        }
    ];

    techStack = [
        { name: 'Angular 20', level: 'Framework' },
        { name: 'NgRx 18', level: 'State Engine' },
        { name: 'Leaflet', level: 'Geospatial' },
        { name: 'RxJS', level: 'Reactive Core' }
    ];
}
