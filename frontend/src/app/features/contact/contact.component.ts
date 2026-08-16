import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from './contact.service';
import { TurnstileComponent } from '../../shared/turnstile/turnstile.component';
import { ThemeService } from '../../core/services/theme.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { environment } from '../../../environments/environment';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TurnstileComponent, RevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  theme = inject(ThemeService);

  turnstileSiteKey = environment.turnstileSiteKey;

  @ViewChild(TurnstileComponent) turnstile?: TurnstileComponent;

  state = signal<SubmitState>('idle');
  errorMessage = signal<string | null>(null);
  turnstileToken = signal<string | null>(null);

  socials = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/tharun-full-stack-developer/', icon: 'linkedin', detail: 'tharun-full-stack-developer' },
    { label: 'Email', href: 'mailto:tonitharun@gmail.com', icon: 'mail', detail: 'tonitharun@gmail.com' },
    { label: 'Phone', href: 'tel:+917416186364', icon: 'phone', detail: '+91 7416186364' },
    { label: 'Location', href: '#contact', icon: 'map-pin', detail: 'Hyderabad, India' },
  ];

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    company: [''], // honeypot; kept empty by real users, hidden via CSS
  });

  onTurnstileVerified(token: string): void {
    this.turnstileToken.set(token);
  }

  onTurnstileExpired(): void {
    this.turnstileToken.set(null);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.state() === 'submitting') {
      this.form.markAllAsTouched();
      return;
    }

    const token = this.turnstileToken();
    if (!token) {
      this.state.set('error');
      this.errorMessage.set('Please complete the verification challenge.');
      return;
    }

    this.state.set('submitting');
    this.errorMessage.set(null);

    try {
      const { name, email, message, company } = this.form.getRawValue();

      const res = await this.contactService.submit({
        name,
        email,
        message,
        company,
        turnstileToken: token,
      });

      if (res.ok) {
        this.state.set('success');
        this.form.reset();
        this.turnstileToken.set(null);
        this.turnstile?.reset();
      } else {
        this.state.set('error');
        this.errorMessage.set(res.message ?? 'Something went wrong. Please try again.');
        this.turnstile?.reset();
      }
    } catch (err: any) {
      this.state.set('error');
      const backendMsg = err?.error?.message || err?.message || 'Could not send your message. Please try again later.';
      this.errorMessage.set(backendMsg);
      this.turnstile?.reset();
    }
  }
}
