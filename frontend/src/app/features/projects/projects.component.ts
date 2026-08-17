import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { Project } from '../../core/models/skill.model';

const PROJECTS: Project[] = [
  // --- ENTERPRISE SYSTEMS ---
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

  // --- PERSONAL & OPEN SOURCE PROJECTS ---
  {
    id: 'personal-portfolio',
    title: 'Zoneless Angular 22 Signal-Physics Portfolio',
    category: 'personal',
    clientOrContext: 'Personal Portfolio',
    badge: 'Live & Open Source',
    description:
      'High-performance single-page portfolio engineered with zoneless Angular 22 signals, custom rAF elastic collision physics for skill bubbles, and a Cloudflare Turnstile protected serverless contact API.',
    highlights: [
      'Zoneless Reactivity: 100% signals architecture eliminating zone.js runtime overhead.',
      'Custom Physics: 60fps delta-time normalized elastic bubble collisions and cursor-following parallax.',
      'Serverless Contact: Cloudflare Turnstile captcha token validation and Resend transactional email backend on Vercel.',
    ],
    tags: ['Angular 22', 'Signals', 'TypeScript', 'SCSS', 'Vercel Serverless', 'Cloudflare Turnstile', 'Resend'],
    liveUrl: 'https://tharun-portfolio-rho.vercel.app',
    repoUrl: 'https://github.com/tharun850/tharun-portfolio',
  },
  {
    id: 'personal-llama-pi',
    title: 'LLaMA Pi Control Center',
    category: 'personal',
    clientOrContext: 'Open Source Project',
    badge: 'AI & LLM Orchestrator',
    description:
      'Zero-dependency Java 21 & Angular 21 web orchestrator for hosting local LLMs (llama-server), streaming real-time Server-Sent Events (SSE) logs, and managing Pi Coding Agent workspaces.',
    highlights: [
      'Local LLM Hosting: Orchestrates local inference models via llama-server with zero external runtime dependencies.',
      'Real-Time SSE Streaming: Streams token-by-token generation logs and server metrics directly to the Angular UI.',
      'Agent Workspace Management: Manages autonomous coding agent work environments and session state.',
    ],
    tags: ['Java 21', 'Angular', 'LLM Orchestration', 'llama-server', 'SSE Streaming', 'AI Agents'],
    repoUrl: 'https://github.com/tharun850/llama-pi-control-center',
  },
  {
    id: 'personal-naukribot',
    title: 'NaukriBot & Career Automation Engine',
    category: 'personal',
    clientOrContext: 'Open Source Project',
    badge: 'Live Platform & Code',
    description:
      'Multi-account job search and recruitment automation bot featuring automated scheduled runs, auto-application pipelines, profile headline rotation, dynamic resume uploads, and an SSE live status dashboard.',
    highlights: [
      'Multi-Account Automation: Orchestrates multi-profile lifecycle automation with anti-detection throttling.',
      'Auto-Apply & Profile Refresh: Automated resume syncing and dynamic headline rotations to optimize recruiter visibility.',
      'Live SSE Dashboard: Real-time execution telemetry and streaming log output to the web interface.',
    ],
    tags: ['Java', 'Spring Boot', 'Automation', 'Web Scraping', 'SSE Streaming', 'Scheduling'],
    liveUrl: 'https://inot.qzz.io/naukri-bot/',
    repoUrl: 'https://github.com/tharun850/naukribot',
  },
  {
    id: 'personal-3dtorch',
    title: '3D Torch — Interactive Angular Lighting Simulation',
    category: 'personal',
    clientOrContext: 'Open Source UI',
    badge: 'Live Demo & Code',
    description:
      'An interactive Angular 3D lighting application that tracks cursor movement to dynamically project a volumetric 3D light cone and perspective specular highlights onto typography and surfaces.',
    highlights: [
      'Dynamic Lighting: Cursor-following 3D cone-of-light projection with ray-cast surface illumination.',
      'Reactive Math: Smooth GPU-accelerated CSS 3D transforms, perspective math, and dynamic specular shading.',
    ],
    tags: ['Angular', 'TypeScript', 'SCSS', '3D Transforms', 'CSS Physics', 'Interactive UI'],
    liveUrl: 'https://threedtorch.onrender.com/',
    repoUrl: 'https://github.com/tharun850/3dTorch',
  },
  {
    id: 'personal-questions-generator',
    title: 'PDF Questions & Examination Generator',
    category: 'personal',
    clientOrContext: 'Open Source Project',
    badge: 'Live Web App & Code',
    description:
      'Automated document parser and assessment engine that extracts text and structure from PDF textbooks and lecture notes to generate interactive quizzes, multiple-choice exams, and automated grading.',
    highlights: [
      'Document Parsing: Extracts structured knowledge chapters and key concepts from unstructured PDF documents.',
      'Assessment Generation: Automatically formats categorized questions with instant grading and review.',
    ],
    tags: ['TypeScript', 'Angular', 'PDF Processing', 'Question Generator', 'EdTech'],
    liveUrl: 'https://tharun850.github.io/PDFQuestionsToExam/',
    repoUrl: 'https://github.com/tharun850/PDFQuestionsToExam',
  },
  {
    id: 'personal-resume-skill-builder',
    title: 'AI Resume Skill Matcher & Vector ATS Builder',
    category: 'personal',
    clientOrContext: 'Open Source AI Tool',
    badge: 'Live AI App & Code',
    description:
      'Client-side privacy-first Angular web application that extracts missing skills from job portal screenshots using Multimodal AI Vision models and generates instant ATS-optimized single-page vector PDF resumes.',
    highlights: [
      'Multimodal Vision Extraction: Extracts only missing and unmatched skill tags from job portal screenshots (LinkedIn / Naukri).',
      'Local & Cloud AI Flexibility: Connects with local offline models (LM Studio / Ollama Qwen2-VL) or OpenAI-compatible cloud APIs.',
      'Single-Page Vector PDF: Generates clean, ATS-compliant PDF resumes with 100% client-side privacy (no data leaves the browser).',
    ],
    tags: [
      'Angular',
      'TypeScript',
      'OpenAI Vision',
      'Local LLMs / Ollama',
      'ATS Resume',
      'PDF Generation',
      'SCSS',
    ],
    liveUrl: 'https://tharun850.github.io/resume-skill-builder/',
    repoUrl: 'https://github.com/tharun850/resume-skill-builder',
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

  enterpriseCount = computed(
    () => this.allProjects().filter((p) => p.category === 'enterprise').length
  );
  personalCount = computed(
    () => this.allProjects().filter((p) => p.category === 'personal').length
  );

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
