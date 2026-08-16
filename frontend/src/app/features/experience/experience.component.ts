import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { EducationCert, ResumeEntry } from '../../core/models/skill.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ParallaxDirective, RevealDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  entries = signal<ResumeEntry[]>([
    {
      id: 'r1',
      role: 'Full Stack Developer',
      org: 'IntouchCX',
      client: 'ComPsych (Healthcare)',
      location: 'Hyderabad, India',
      period: 'Jan 2025 — Present',
      bullets: [
        'Architected and developed a full-stack enterprise web application using Angular and Spring Boot, ensuring seamless integration and optimal performance across services.',
        'Implemented Google OAuth2 authentication and built HTTP interceptors for automated JWT token refresh; integrated Spring Data JPA with MS SQL Server for robust data persistence.',
        'Designed Angular Reactive Forms with extensive validation, leveraging Angular Signals and Route Resolvers for reactive state management and data pre-loading.',
        'Led migration of legacy SOAP services to high-performance RESTful APIs, modernizing service integrations and improving interoperability across the stack.',
        'Migrated the distributed caching layer to Apache Ignite for reference data and session storage, improving cache performance and reliability across high-throughput pipelines.',
        'Led platform upgrade from JBoss 7 to JBoss 8 alongside a Java 11 to Java 21 migration, delivered with zero downtime.',
        'Established CI/CD pipelines using Jenkins and Docker; implemented frontend test automation with Karma, Jasmine, and Protractor.',
      ],
      tags: [
        'Java 21',
        'Spring Boot',
        'Angular',
        'Angular Signals',
        'Apache Ignite',
        'OAuth2 / JWT',
        'MS SQL Server',
        'Docker',
        'Jenkins',
      ],
    },
    {
      id: 'r2',
      role: 'Full Stack Developer',
      org: 'Virtusa Consulting Services',
      client: 'Citi Bank (Banking)',
      location: 'Hyderabad, India',
      period: 'Jun 2022 — Jan 2025',
      bullets: [
        'Architected real-time, event-driven data pipelines using Apache Kafka to decouple external loan-application intake from time-intensive backend processing, reducing system latency by 70%.',
        'Engineered high-performance data processing applications using Apache Commons Diff-Builder and the Java Stream API to aggregate and transform data from REST APIs and databases.',
        'Developed a custom ORM framework using the Java Reflection API for dynamic entity mapping and annotation processing, streamlining legacy database interactions.',
        'Designed enterprise-grade validation frameworks via the Java Reflection API, adopted as a cross-team engineering standard across multiple project squads.',
        'Architected scalable Spring Boot microservices with Spring Cloud load balancing and horizontal scaling, successfully handling a 200% traffic surge.',
      ],
      tags: [
        'Apache Kafka',
        'Spring Boot',
        'Spring Cloud',
        'Java Reflection API',
        'Microservices',
        'Event-Driven Architecture',
        'JUnit / Mockito',
        'MySQL / Oracle',
      ],
    },
  ]);

  educationAndCerts = signal<EducationCert[]>([
    {
      id: 'c1',
      title: 'Oracle Certified Associate, Java SE 8 Programmer',
      institution: 'Oracle University',
      periodOrDate: 'Valid from Nov 2022',
      scoreOrDetail: 'Certified Java SE 8 Associate',
      type: 'certification',
    },
    {
      id: 'e1',
      title: 'B.Tech in Engineering',
      institution: 'JNTUK, University College of Engineering, Narasaraopet',
      periodOrDate: 'Jun 2018 — Jun 2022',
      scoreOrDetail: 'GPA: 7.25 / 10.0',
      type: 'education',
    },
  ]);
}
