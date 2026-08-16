import { Injectable, signal, OnDestroy } from '@angular/core';

/**
 * Tracks scroll position and a smoothed, velocity-based scroll speed
 * every animation frame. Consumed by ParallaxDirective and any component
 * that wants "premium" velocity-reactive motion (e.g. easing skew/blur
 * based on how fast the user is scrolling).
 *
 * Runs zoneless: signal writes below (scrollY.set, velocity.set, etc.)
 * schedule change detection on their own, so there's no need to route
 * this through NgZone.run()/runOutsideAngular() the way you would in a
 * zone.js-based app.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService implements OnDestroy {
  readonly scrollY = signal(0);
  readonly progress = signal(0); // 0..1 of full page scroll
  readonly velocity = signal(0); // smoothed px/frame, signed
  readonly direction = signal<'up' | 'down'>('down');

  private lastY = 0;
  private lastTime = performance.now();
  private smoothedVelocity = 0;
  private rafId = 0;
  private readonly SMOOTHING = 0.15;

  constructor() {
    this.rafId = requestAnimationFrame(this.loop);
  }

  private loop = () => {
    const now = performance.now();
    const dt = Math.max(now - this.lastTime, 1);
    const y = window.scrollY;
    const dy = y - this.lastY;
    const instVelocity = (dy / dt) * 16.67; // normalize to px per ~60fps frame

    this.smoothedVelocity += (instVelocity - this.smoothedVelocity) * this.SMOOTHING;

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );

    this.scrollY.set(y);
    this.progress.set(Math.min(Math.max(y / maxScroll, 0), 1));
    this.velocity.set(this.smoothedVelocity);
    if (Math.abs(dy) > 0.5) {
      this.direction.set(dy >= 0 ? 'down' : 'up');
    }

    this.lastY = y;
    this.lastTime = now;
    this.rafId = requestAnimationFrame(this.loop);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }
}
