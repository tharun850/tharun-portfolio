import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { Project } from '../../core/models/skill.model';

const PROJECTS: Project[] = [
  {
    id: 'banking-collateral-lending',
    title: 'Automated Collateralized Lending & Margin Financing Engine',
    category: 'enterprise',
    clientOrContext: 'Tier-1 Investment Banking (Virtusa)',
    badge: 'Enterprise Banking Platform',
    description:
      'An automated mission-critical platform providing collateralized credit and margin financing services to High-Net-Worth Individuals (HNWI) against their securities and asset portfolios.',
    highlights: [
      'Credit & Loan Booking Engine: Built the loan origination and credit booking module enabling Relationship Managers to book, track, and manage client credit facilities in core banking systems.',
      'Real-Time Margin & Risk Calculation: Dynamic position evaluation based on liabilities (loan value) vs asset valuations, automatically triggering risk alerts and margin notifications upon threshold breaches.',
      'Market Data Feeds & Intraday Valuation: Integrated market data feeds (Bloomberg) with core banking records for End-of-Day (EOD) batch processing plus an on-demand Intraday calculation engine for real-time position recalculation.',
      'Event-Driven Latency Reduction: Architected Kafka pipelines to decouple loan application intake from backend ledger processing, slashing system latency by 70%.',
    ],
    tags: [
      'Java 21',
      'Spring Boot',
      'Apache Kafka',
      'Microservices',
      'Market Data Feeds',
      'Oracle / MySQL',
      'Java Reflection API',
      'Banking & Lending',
    ],
  },
  {
    id: 'healthcare-intake-portal',
    title: 'Enterprise Healthcare Patient & Provider Intake Portal',
    category: 'enterprise',
    clientOrContext: 'Global Healthcare Platform (IntouchCX)',
    badge: 'Live End-User Application',
    description:
      'A high-traffic, live healthcare enterprise web portal used daily by end-user patients and healthcare providers for clinical appointment booking, benefits verification, and secure records intake.',
    highlights: [
      'Live in Production: Serving thousands of active patients and healthcare practitioners with high availability.',
      'Reactive UI Architecture: Built with Angular 19, Angular Signals, and Reactive Forms with complex multi-step validation.',
      'OAuth2 & Security: Implemented Google OAuth2 single sign-on and custom HTTP interceptors for automated JWT token refresh.',
      'Data Layer: Connected Spring Data JPA with MS SQL Server for encrypted, HIPAA-compliant patient records storage.',
    ],
    tags: [
      'Angular',
      'Angular Signals',
      'Spring Boot',
      'Google OAuth2',
      'JWT Interceptors',
      'MS SQL Server',
      'Healthcare Domain',
    ],
  },
  {
    id: 'healthcare-cache-pipeline',
    title: 'Distributed Healthcare Benefits & Caching Pipeline',
    category: 'enterprise',
    clientOrContext: 'Global Healthcare Platform (IntouchCX)',
    badge: 'Live End-User Application',
    description:
      'Live distributed caching and high-throughput API integration engine powering instantaneous healthcare benefit eligibility calculations across high-concurrency pipelines.',
    highlights: [
      'Live in Production: Serves high-throughput live benefit eligibility checks with sub-millisecond response times.',
      'Distributed Caching: Migrated caching layer to Apache Ignite for reference data and session storage, eliminating database bottlenecks.',
      'SOAP-to-REST Modernization: Led migration of legacy SOAP web services to modern RESTful JSON endpoints.',
      'Platform Upgrade: Upgraded JBoss 7 to JBoss 8 alongside Java 11 to Java 21 migration with zero downtime.',
    ],
    tags: [
      'Apache Ignite',
      'Java 21',
      'Spring Boot',
      'REST APIs',
      'SOAP-to-REST',
      'Docker',
      'Jenkins CI/CD',
      'JBoss EAP 8',
    ],
  },
  {
    id: 'personal-analytics',
    title: 'Real-Time Event-Driven Financial Analytics Dashboard',
    category: 'personal',
    clientOrContext: 'Personal Project',
    badge: 'Live Demo & Open Source',
    description:
      'Full-stack reactive financial dashboard streaming live stock quotes, portfolio valuations, and margin metrics via WebSockets with smooth D3 animated chart transitions.',
    highlights: [
      'Frontend: Built with Angular Signals, RxJS WebSocket streams, and D3.js interactive charts.',
      'Backend: Spring Boot WebSocket broker with scheduled mock ticker streams and in-memory order matching.',
    ],
    tags: ['Angular', 'Angular Signals', 'Spring Boot', 'WebSockets', 'D3.js', 'RxJS'],
    liveUrl: 'https://github.com/tonitharun',
    repoUrl: 'https://github.com/tonitharun',
  },
  {
    id: 'personal-orm',
    title: 'Dynamic Reflection ORM & Validation Framework',
    category: 'personal',
    clientOrContext: 'Open Source',
    badge: 'GitHub Open Source',
    description:
      'A lightweight, annotation-driven Java ORM and declarative validation engine built entirely using the Java Reflection API to eliminate boilerplate SQL and enforce cross-entity data integrity.',
    highlights: [
      'Dynamic Mapping: Automatically maps POJOs to relational tables using custom annotations.',
      'Cross-Entity Validation: Implements reusable runtime constraint validators adopted across multi-module projects.',
    ],
    tags: ['Java 21', 'Java Reflection API', 'Spring Data JPA', 'Design Patterns', 'JUnit 5'],
    liveUrl: 'https://github.com/tonitharun',
    repoUrl: 'https://github.com/tonitharun',
  },
  {
    id: 'personal-portfolio',
    title: 'Zoneless Angular 22 Signal-Physics Portfolio',
    category: 'personal',
    clientOrContext: 'Personal Portfolio',
    badge: 'Live Project',
    description:
      'Modern, high-performance single-page portfolio engineered with zoneless Angular 22 change detection, custom rAF collision physics for skill bubbles, and Cloudflare Turnstile protected email backend.',
    highlights: [
      'Zoneless Performance: 100% signals reactivity with zero zone.js overhead.',
      'Custom Physics: 60fps delta-time normalized elastic bubble collisions and cursor-following parallax.',
      'Secure Contact: Cloudflare Turnstile token validation and Resend transactional email backend.',
    ],
    tags: ['Angular 22', 'Signals', 'TypeScript', 'SCSS', 'Cloudflare Turnstile', 'Resend'],
    liveUrl: 'https://github.com/tonitharun',
    repoUrl: 'https://github.com/tonitharun',
  },
];

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ParallaxDirective, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  activeTab = signal<'all' | 'enterprise' | 'personal'>('all');
  allProjects = signal<Project[]>(PROJECTS);

  filteredProjects = computed(() => {
    const tab = this.activeTab();
    const list = this.allProjects();
    if (tab === 'all') return list;
    return list.filter((p) => p.category === tab);
  });

  setTab(tab: 'all' | 'enterprise' | 'personal'): void {
    this.activeTab.set(tab);
  }
}
