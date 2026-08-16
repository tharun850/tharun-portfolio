import { Directive, ElementRef, OnDestroy, OnInit, inject, input, signal } from '@angular/core';

/**
 * Pops an element in when it scrolls into the viewport, and pops it back
 * out (reverting to the hidden state) when it scrolls out — driven by
 * IntersectionObserver rather than the scroll loop, so it's cheap and
 * runs independently of the parallax/physics rAF loops.
 *
 * Usage:
 *   <div appReveal>...</div>                            -- default fade + rise
 *   <div appReveal [variant]="'scale'">...</div>         -- fade + scale up
 *   <div appReveal [revealDelay]="120">...</div>         -- stagger multiple items
 *
 * NOTE: `variant` is intentionally NOT aliased to the `appReveal` selector
 * name. If it were (e.g. `input<'rise'|'scale'>('rise', { alias: 'appReveal' })`),
 * Angular treats a bare `appReveal` attribute (no `="..."`) as a static
 * string binding of `""` to that aliased input — which fails to typecheck
 * against a `'rise' | 'scale'` union and breaks the build. Keeping the
 * selector a plain presence-marker and `variant` a separate input avoids
 * that entirely, at the small cost of `[variant]` needing its own binding.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[class.reveal]': 'true',
    '[class.reveal-scale]': "variant() === 'scale'",
    '[class.reveal-visible]': 'visible()',
    '[style.transition-delay.ms]': 'visible() ? revealDelay() : 0',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  variant = input<'rise' | 'scale'>('rise');
  revealDelay = input(0);

  visible = signal(false);

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Toggling both ways gives the "pop in AND pop out" feel
          // requested — elements re-animate every time they cross the
          // viewport edge, not just on first scroll-into-view.
          this.visible.set(entry.isIntersecting);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
