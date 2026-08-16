import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

/**
 * A pronounced, cursor-following 3D tilt on hover — distinct from the
 * subtle scroll-velocity tilt in ParallaxDirective (which is disabled by
 * default everywhere). This is intentionally the only tilt effect used
 * in the app, and it's applied exclusively to the Resume card.
 *
 * Usage:
 *   <div class="card" appTiltHover>...</div>
 *   <div class="card" appTiltHover [maxTilt]="12" [scaleOnHover]="1.04">...</div>
 */
@Directive({
  selector: '[appTiltHover]',
  standalone: true,
  host: {
    class: 'tilt-hover',
  },
})
export class TiltHoverDirective {
  maxTilt = input(8); // degrees of rotation at the card's edge
  scaleOnHover = input(1.02);

  private el = inject(ElementRef<HTMLElement>);
  private rafId = 0;

  @HostListener('pointermove', ['$event'])
  onPointerMove(ev: PointerEvent): void {
    if (ev.pointerType === 'touch') return; // avoid fighting with touch-scroll/drag

    const rect = this.el.nativeElement.getBoundingClientRect();
    const px = (ev.clientX - rect.left) / rect.width; // 0 (left) .. 1 (right)
    const py = (ev.clientY - rect.top) / rect.height; // 0 (top) .. 1 (bottom)

    const tilt = this.maxTilt();
    const rotateX = (0.5 - py) * 2 * tilt;
    const rotateY = (px - 0.5) * 2 * tilt;

    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.el.nativeElement.style.transform =
        `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${this.scaleOnHover()})`;
    });
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    cancelAnimationFrame(this.rafId);
    this.el.nativeElement.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
  }
}
