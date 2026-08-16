import { Component, signal } from '@angular/core';
import { NavbarComponent } from './features/navbar/navbar.component';
import { HeroComponent } from './features/hero/hero.component';
import { SkillsBubblesComponent } from './features/skills-bubbles/skills-bubbles.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ExperienceComponent } from './features/experience/experience.component';
import { TerminalComponent } from './features/terminal/terminal.component';
import { ResumeComponent } from './features/resume/resume.component';
import { ContactComponent } from './features/contact/contact.component';
import { FooterComponent } from './features/footer/footer.component';
import { RevealDirective } from './core/directives/reveal.directive';
import { Skill, SkillCategory } from './core/models/skill.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    SkillsBubblesComponent,
    ExperienceComponent,
    ProjectsComponent,
    TerminalComponent,
    ResumeComponent,
    ContactComponent,
    FooterComponent,
    RevealDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  skills = signal<Skill[]>([
    { id: 's1', label: 'Java 21', level: 95, color: '#f89820' },
    { id: 's2', label: 'Spring Boot', level: 95, color: '#6db33f' },
    { id: 's3', label: 'Angular', level: 92, color: '#dd0031' },
    { id: 's4', label: 'Microservices', level: 92, color: '#6c5ce7' },
    { id: 's5', label: 'Apache Kafka', level: 90, color: '#231f20' },
    { id: 's6', label: 'Apache Ignite', level: 88, color: '#e44026' },
    { id: 's7', label: 'Angular Signals', level: 90, color: '#00d1b2' },
    { id: 's8', label: 'OAuth2 / JWT', level: 88, color: '#4dabf7' },
    { id: 's9', label: 'Spring Data JPA', level: 90, color: '#339933' },
    { id: 's10', label: 'MS SQL Server', level: 85, color: '#cc292b' },
    { id: 's11', label: 'Docker & CI/CD', level: 85, color: '#2496ed' },
    { id: 's12', label: 'TypeScript', level: 88, color: '#3178c6' },
  ]);

  skillCategories = signal<SkillCategory[]>([
    {
      title: 'Languages',
      skills: ['Java 21', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL'],
    },
    {
      title: 'Frontend Frameworks & State',
      skills: [
        'Angular (v14 - v19/22)',
        'Angular Signals',
        'Reactive Forms',
        'Route Resolvers',
        'HTTP Interceptors',
        'RxJS',
        'SCSS / CSS3',
      ],
    },
    {
      title: 'Backend & Microservices',
      skills: [
        'Spring Boot',
        'Spring Cloud',
        'Spring Security',
        'Spring Data JPA',
        'RESTful API Design',
        'JWT & Google OAuth2',
        'SOAP-to-REST Migration',
      ],
    },
    {
      title: 'Messaging, Caching & Data',
      skills: [
        'Apache Kafka (Event-Driven)',
        'Apache Ignite (Distributed Cache)',
        'MS SQL Server',
        'MySQL',
        'Oracle PL/SQL',
      ],
    },
    {
      title: 'DevOps, Cloud & Architecture',
      skills: [
        'Microservices Architecture',
        'Event-Driven Architecture',
        'Docker',
        'Jenkins CI/CD',
        'Git & GitHub',
        'AWS',
        'JBoss EAP 7 / 8',
      ],
    },
    {
      title: 'Testing & Engineering Practices',
      skills: [
        'JUnit & Mockito',
        'Karma & Jasmine',
        'Selenium WebDriver',
        'Agile / Scrum',
        'Clean Code & SOLID',
        'Java Reflection API',
      ],
    },
  ]);
}
