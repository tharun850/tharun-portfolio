import { Component } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <footer class="footer" appReveal>
      <p>&copy; {{ year }} <strong>Tharun Kumar Doddi</strong> &middot; Full-Stack Engineer (Java &middot; Spring Boot &middot; Angular &middot; Kafka)</p>
      <p class="sub">Crafted with Angular 22, Signals, and zoneless architecture.</p>
    </footer>
  `,
  styles: [
    `
      .footer {
        text-align: center;
        padding: 40px 16px 56px;
        color: var(--text-muted);
        font-size: 0.9rem;
        border-top: 1px solid var(--glass-border);

        strong {
          color: var(--text);
        }

        .sub {
          font-size: 0.78rem;
          margin-top: 6px;
          opacity: 0.75;
        }
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
