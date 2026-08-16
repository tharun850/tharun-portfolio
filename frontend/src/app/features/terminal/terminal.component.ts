import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../../core/directives/reveal.directive';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
})
export class TerminalComponent {
  @ViewChild('terminalInput') inputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('terminalBody') bodyRef?: ElementRef<HTMLDivElement>;

  currentCommand = '';
  history = signal<TerminalLine[]>([
    { type: 'output', text: 'Welcome to Tharun Kumar Doddi\'s Interactive Developer Shell [v2.4.0]' },
    { type: 'output', text: 'Type "help" to view available commands, or click any chip below.' },
  ]);

  quickCommands = ['help', 'whoami', 'skills', 'experience', 'projects', 'stats', 'certifications', 'contact', 'download-resume', 'clear'];

  runCommand(cmd: string): void {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    this.history.update((h) => [...h, { type: 'input', text: `tharun@portfolio:~$ ${trimmed}` }]);
    this.currentCommand = '';

    const lower = trimmed.toLowerCase();

    switch (lower) {
      case 'help':
        this.addOutput([
          'AVAILABLE COMMANDS:',
          '  whoami          - Brief developer introduction',
          '  skills          - Core technologies and enterprise stack',
          '  experience      - Employment history (IntouchCX & Virtusa)',
          '  projects        - Key systems shipped (Lending, Healthcare, Open Source)',
          '  stats           - Key engineering impact metrics (70% latency cut, etc.)',
          '  certifications  - Oracle Certified Java Associate & Education',
          '  contact         - Reach out via email, phone, or LinkedIn',
          '  download-resume - Trigger direct download of Tharun\'s resume PDF',
          '  clear           - Clear terminal screen',
        ]);
        break;

      case 'whoami':
        this.addOutput([
          'Tharun Kumar Doddi — Full-Stack Engineer (4+ Years Experience)',
          'Specialization: Java 21, Spring Boot, Angular Signals, Apache Kafka, Apache Ignite',
          'Domain Expertise: Tier-1 Investment Banking & Global Healthcare Systems',
          'Location: Hyderabad, India | Oracle Certified Java SE 8 Associate',
        ]);
        break;

      case 'skills':
        this.addOutput([
          'CORE STACK proficiencies:',
          '  • Backend: Java 21, Spring Boot, Spring Cloud, Spring Security, REST APIs, OAuth2/JWT',
          '  • Frontend: Angular 19/22, Angular Signals, Reactive Forms, Route Resolvers, SCSS',
          '  • Data & Messaging: Apache Kafka, Apache Ignite, MS SQL Server, MySQL, Oracle PL/SQL',
          '  • DevOps & Tools: Docker, Jenkins CI/CD, Git, AWS, JBoss EAP 8, JUnit, Mockito',
        ]);
        break;

      case 'experience':
        this.addOutput([
          'WORK HISTORY:',
          '  1. Full Stack Developer @ IntouchCX (Client: Healthcare Domain) [Jan 2025 - Present]',
          '     - Full-stack Angular/Spring Boot, Apache Ignite caching, OAuth2/JWT interceptors.',
          '  2. Full Stack Developer @ Virtusa Consulting Services (Client: Banking) [Jun 2022 - Jan 2025]',
          '     - Kafka real-time event-driven loan pipeline, custom Java reflection ORM/validation.',
        ]);
        break;

      case 'projects':
        this.addOutput([
          'KEY PROJECTS & SYSTEMS:',
          '  • Automated Collateralized Lending Engine (Kafka, Spring Boot, Microservices, Bloomberg)',
          '  • Healthcare Patient & Provider Intake Portal (Live Angular Signals + Spring Boot)',
          '  • Distributed Healthcare Benefits & Caching Pipeline (Apache Ignite, SOAP-to-REST)',
          '  • Real-Time Financial Analytics Dashboard (WebSockets, Angular, D3.js)',
          '  • Dynamic Reflection ORM & Validation Engine (Java 21 Open Source)',
        ]);
        break;

      case 'stats':
        this.addOutput([
          'KEY IMPACT METRICS:',
          '  ⚡ 70% System Latency Cut via Kafka Event-Driven Decoupling',
          '  🚀 200% Traffic Surge Handled with Spring Cloud Load Balancing',
          '  🛡️ 100% Uptime across Java 11 -> 21 & JBoss 7 -> 8 Migrations',
          '  💼 4+ Years of Full-Stack Enterprise Engineering Experience',
        ]);
        break;

      case 'certifications':
        this.addOutput([
          'CERTIFICATIONS & EDUCATION:',
          '  🏆 Oracle Certified Associate, Java SE 8 Programmer (Oracle University, Nov 2022)',
          '  🎓 B.Tech in Engineering — JNTUK, University College of Engineering (GPA: 7.25 / 10.0)',
        ]);
        break;

      case 'download-resume':
        this.addOutput([
          'Downloading Tharun_Kumar_Doddi_Resume.pdf...',
        ]);
        if (typeof document !== 'undefined') {
          const a = document.createElement('a');
          a.href = 'assets/resume.pdf';
          a.download = 'Tharun_Kumar_Doddi_Resume.pdf';
          a.click();
        }
        break;

      case 'contact':
        this.addOutput([
          'DIRECT CONTACT CHANNELS:',
          '  📧 Email:    tonitharun@gmail.com',
          '  📞 Phone:    +91 7416186364',
          '  💼 LinkedIn: https://linkedin.com/in/tharun-full-stack-developer/',
          '  📍 Location: Hyderabad, India',
          'Scrolling to contact form below...',
        ]);
        if (typeof document !== 'undefined') {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'clear':
        this.history.set([]);
        break;

      case 'sudo':
        this.addOutput(['Permission granted: You already have full root privileges to explore!']);
        break;

      default:
        this.history.update((h) => [
          ...h,
          { type: 'error', text: `Command not recognized: "${trimmed}". Type "help" for a list of commands.` },
        ]);
        break;
    }

    setTimeout(() => {
      if (this.bodyRef) {
        this.bodyRef.nativeElement.scrollTop = this.bodyRef.nativeElement.scrollHeight;
      }
    }, 50);
  }

  private addOutput(lines: string[]): void {
    const formatted: TerminalLine[] = lines.map((text) => ({ type: 'output', text }));
    this.history.update((h) => [...h, ...formatted]);
  }

  focusInput(): void {
    this.inputRef?.nativeElement.focus();
  }
}
