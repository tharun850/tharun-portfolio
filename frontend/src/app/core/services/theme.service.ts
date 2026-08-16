import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

/**
 * Signal-based theme service.
 * Dark mode is the default theme (per design spec) and is persisted
 * to localStorage so it survives reloads.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'portfolio-theme';

  readonly theme = signal<Theme>(this.getInitialTheme());
  readonly isDark = computed<boolean>(() => this.theme() === 'dark');

  constructor() {
    // Keep <html data-theme="..."> and localStorage in sync with the signal.
    effect(() => {
      const t = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.style.colorScheme = t;
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, t);
      }
    });
  }

  private getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (saved === 'dark' || saved === 'light') return saved;
    // Default is always dark, regardless of OS preference, per spec.
    return 'dark';
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    this.theme.set(theme);
  }
}
