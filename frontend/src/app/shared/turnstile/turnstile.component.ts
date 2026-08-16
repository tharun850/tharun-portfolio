import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  output,
  input,
  effect,
} from '@angular/core';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

/**
 * Renders a Cloudflare Turnstile widget and emits the verification token
 * once the visitor passes the challenge (often automatically, with no
 * interaction needed). Free, unlimited, no Google Cloud account required.
 *
 * Load the script once in index.html:
 *   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
 *
 * IMPORTANT on theming: pass `theme` as 'light'/'dark' bound to your own
 * ThemeService signal (e.g. `[theme]="theme.isDark() ? 'dark' : 'light'"`)
 * rather than relying on the default 'auto' value. 'auto' follows the
 * *browser/OS* `prefers-color-scheme`, which has nothing to do with an
 * in-app dark-mode toggle — so a visitor whose OS is set to light mode
 * would always see a light widget even after switching this app to dark.
 * Turnstile also only reads `theme` at render time, so this component
 * removes and re-renders the widget whenever the theme input changes,
 * to keep it in sync when the user flips the toggle mid-session.
 */
@Component({
  selector: 'app-turnstile',
  standalone: true,
  template: `<div #widget></div>`,
})
export class TurnstileComponent implements AfterViewInit, OnDestroy {
  siteKey = input.required<string>();
  theme = input<'light' | 'dark' | 'auto'>('auto');

  verified = output<string>();
  expired = output<void>();

  @ViewChild('widget', { static: true }) widgetRef!: ElementRef<HTMLDivElement>;

  private widgetId?: string;
  private pollId?: ReturnType<typeof setInterval>;
  private viewReady = false;

  constructor() {
    // Re-render with the new theme whenever it changes after the initial
    // render (ngAfterViewInit handles the very first render below).
    effect(() => {
      const t = this.theme();
      if (!this.viewReady) return;
      this.renderWhenReady(t);
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderWhenReady(this.theme());
  }

  ngOnDestroy(): void {
    clearInterval(this.pollId);
    if (this.widgetId && window.turnstile) {
      window.turnstile.remove(this.widgetId);
    }
  }

  /** Call after a submit attempt fails, to force a fresh token on retry. */
  reset(): void {
    if (this.widgetId && window.turnstile) {
      window.turnstile.reset(this.widgetId);
    }
  }

  private renderWhenReady(theme: 'light' | 'dark' | 'auto'): void {
    if (window.turnstile) {
      if (this.widgetId) {
        window.turnstile.remove(this.widgetId);
        // The old token is gone along with the old widget instance —
        // let the parent know so it doesn't try to submit a stale one.
        this.expired.emit();
      }
      this.widgetId = window.turnstile.render(this.widgetRef.nativeElement, {
        sitekey: this.siteKey(),
        theme,
        callback: (token) => this.verified.emit(token),
        'expired-callback': () => this.expired.emit(),
        'error-callback': () => this.expired.emit(),
      });
      return;
    }
    // The api.js script loads async; poll briefly until it's available.
    clearInterval(this.pollId);
    this.pollId = setInterval(() => {
      if (window.turnstile) {
        clearInterval(this.pollId);
        this.renderWhenReady(theme);
      }
    }, 100);
  }
}
