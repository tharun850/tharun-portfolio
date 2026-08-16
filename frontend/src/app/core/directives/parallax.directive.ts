import { Directive, ElementRef, Input, effect, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';

/**
 * Custom velocity-based parallax directive.
 *
 * Usage:
 *   <div [appParallax]="0.3" [maxOffset]="150">...</div>
 *
 * speed      -> how much the element moves relative to its own distance
 *               from the viewport center (negative = opposite direction)
 * maxOffset  -> clamps the translation so layers never drift off-screen
 *
 * IMPORTANT: the offset is driven by the element's position relative to
 * the viewport (via getBoundingClientRect), not by the page's absolute
 * scrollY. Using absolute scrollY meant elements far down a long page
 * (e.g. a "Projects" heading) would already have a huge scrollY the
 * moment they entered view, pinning them at maxOffset permanently and
 * overlapping neighbouring content. Distance-from-center naturally
 * settles back to ~0 as an element reaches the middle of the screen,
 * which is what a "parallax" effect should actually look like.
 *
 * The element's transform is lerped toward a target offset every frame,
 * giving it inertia/"catch-up" motion instead of rigidly tracking scroll.
 * `tiltEnabled` defaults to false: the subtle scroll-velocity rotate is
 * reserved for spots that explicitly opt in. The Resume card uses a
 * separate, more pronounced mouse-hover 3D tilt (`appTiltHover`) instead —
 * tilt as a visual effect is intentionally exclusive to that one card.
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective {
  @Input('appParallax') speed = 0.3;
  @Input() maxOffset = 60;
  @Input() tiltEnabled = false;

  private el = inject(ElementRef<HTMLElement>);
  private scroll = inject(ScrollService);
  private currentOffset = 0;
  private currentTilt = 0;

  // How many px of theoretical travel a speed of 1.0 represents across
  // the full height of the viewport. Keeps `speed` values intuitive
  // (0.05 = subtle, 0.3 = pronounced) independent of screen size.
  private readonly RANGE = 260;

  constructor() {
    effect(() => {
      // Re-run every scroll-service tick (scrollY updates every rAF frame).
      this.scroll.scrollY();
      const velocity = this.scroll.velocity();

      const elm = this.el.nativeElement;
      const rect = elm.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = (elementCenter - viewportH / 2) / viewportH; // ~ -1..1 while on screen

      const target = Math.min(
        Math.max(distanceFromCenter * this.speed * this.RANGE, -this.maxOffset),
        this.maxOffset
      );
      this.currentOffset += (target - this.currentOffset) * 0.12;

      let tilt = 0;
      if (this.tiltEnabled) {
        const targetTilt = Math.min(Math.max(velocity * 0.5, -6), 6);
        this.currentTilt += (targetTilt - this.currentTilt) * 0.2;
        tilt = this.currentTilt;
      }

      elm.style.transform = `translate3d(0, ${this.currentOffset.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      elm.style.willChange = 'transform';
    });
  }
}
