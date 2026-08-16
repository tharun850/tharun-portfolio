import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  signal,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../core/models/skill.model';

interface Bubble {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  dragging: boolean;
  color: string;
  driftAngle: number; // slowly-wandering heading used for idle motion
}

const PALETTE = ['#6c5ce7', '#00d1b2', '#ff6b81', '#ffa94d', '#4dabf7', '#82f5b8'];

// Radius range at the reference (desktop) container width, before scaling.
const REFERENCE_WIDTH = 700;
const BASE_MIN_RADIUS = 30;
const BASE_RADIUS_RANGE = 22; // so level 0-100 maps to 30-52px at reference width
const MIN_SCALE = 0.5; // smallest bubbles shrink to on narrow phones
const MAX_SCALE = 1;

/**
 * A container box of physics-driven "skill bubbles".
 * - Bubbles idle-drift along a slowly wandering heading (smooth, not jittery).
 * - Pointer/touch drag "grabs" a bubble and it follows the cursor.
 * - On release, the drag velocity is imparted to the bubble so it
 *   bounces off the container walls and other bubbles with damping.
 * - Bubble size scales down responsively on narrow (mobile) containers.
 *
 * Pure DOM + rAF physics (no external physics lib), state held in signals.
 * Integration is delta-time normalized so motion speed is consistent
 * regardless of the device's actual frame rate.
 */
@Component({
  selector: 'app-skills-bubbles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-bubbles.component.html',
  styleUrl: './skills-bubbles.component.scss',
})
export class SkillsBubblesComponent implements AfterViewInit, OnDestroy {
  skills = input<Skill[]>([]);

  @ViewChild('box', { static: true }) boxRef!: ElementRef<HTMLDivElement>;

  bubbles = signal<Bubble[]>([]);
  scale = signal(1); // exposed for the template to scale label font-size etc.

  private rafId = 0;
  private width = 0;
  private height = 0;
  private currentScale = 1;
  private targetScale = 1;
  private lastTickTime = performance.now();

  private draggingId: string | null = null;
  private pointerX = 0;
  private pointerY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private dragVX = 0;
  private dragVY = 0;

  private readonly RESTITUTION = 0.7; // wall/bubble bounce energy retained
  private readonly DAMPING = 0.988; // idle air resistance per ~60fps frame
  private readonly IDLE_SPEED = 0.35; // px/frame the idle wander drifts toward
  private readonly IDLE_STEER = 0.012; // how eagerly velocity chases the wander heading
  private readonly IDLE_WANDER = 0.03; // how much the wander heading itself meanders

  ngAfterViewInit(): void {
    this.measure();
    this.currentScale = this.targetScale;
    this.scale.set(this.currentScale);
    this.seedBubbles();
    window.addEventListener('resize', this.measure);
    this.lastTickTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.measure);
  }

  private measure = () => {
    const rect = this.boxRef.nativeElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    const raw = this.width / REFERENCE_WIDTH;
    this.targetScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
  };

  private radiusForLevel(level: number | undefined, scale: number): number {
    return (BASE_MIN_RADIUS + ((level ?? 60) / 100) * BASE_RADIUS_RANGE) * scale;
  }

  private seedBubbles(): void {
    const list = this.skills();
    const scale = this.currentScale;
    const seeded: Bubble[] = list.map((s, i) => {
      const radius = this.radiusForLevel(s.level, scale);
      const angle = (i / Math.max(list.length, 1)) * Math.PI * 2;
      const cx = this.width / 2 + Math.cos(angle) * (this.width * 0.2);
      const cy = this.height / 2 + Math.sin(angle) * (this.height * 0.2);
      return {
        id: s.id,
        label: s.label,
        x: Math.max(radius, Math.min(this.width - radius, cx)),
        y: Math.max(radius, Math.min(this.height - radius, cy)),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius,
        dragging: false,
        color: s.color ?? PALETTE[i % PALETTE.length],
        driftAngle: Math.random() * Math.PI * 2,
      };
    });
    this.bubbles.set(seeded);
  }

  // --- Pointer handlers (called from template) ---

  onPointerDown(ev: PointerEvent, id: string): void {
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    this.draggingId = id;
    this.pointerX = this.lastPointerX = ev.clientX;
    this.pointerY = this.lastPointerY = ev.clientY;
    this.dragVX = 0;
    this.dragVY = 0;
    this.bubbles.update((list) =>
      list.map((b) => (b.id === id ? { ...b, dragging: true, vx: 0, vy: 0 } : b))
    );
  }

  onPointerMove(ev: PointerEvent): void {
    if (!this.draggingId) return;
    this.pointerX = ev.clientX;
    this.pointerY = ev.clientY;
  }

  onPointerUp(): void {
    if (!this.draggingId) return;
    const id = this.draggingId;
    this.draggingId = null;
    this.bubbles.update((list) =>
      list.map((b) =>
        b.id === id
          ? { ...b, dragging: false, vx: this.dragVX, vy: this.dragVY }
          : b
      )
    );
  }

  // --- Physics loop ---

  private tick = () => {
    const now = performance.now();
    // Normalize to "frames at 60fps"; cap so a backgrounded tab resuming
    // doesn't fling bubbles across the box in one giant catch-up step.
    const dt = Math.min((now - this.lastTickTime) / 16.6667, 3);
    this.lastTickTime = now;

    // Smoothly ease bubble size toward the target scale on resize/rotate,
    // instead of snapping, so orientation changes don't feel jarring.
    this.currentScale += (this.targetScale - this.currentScale) * Math.min(0.08 * dt, 1);
    if (Math.abs(this.currentScale - this.scale()) > 0.001) {
      this.scale.set(this.currentScale);
    }

    const box = this.boxRef?.nativeElement;
    if (box) {
      const rect = box.getBoundingClientRect();
      const list = this.bubbles();
      const skillsList = this.skills();
      const next: Bubble[] = list.map((b) => ({ ...b }));

      // Follow-the-cursor for the dragged bubble, with velocity capture
      if (this.draggingId) {
        const dx = this.pointerX - this.lastPointerX;
        const dy = this.pointerY - this.lastPointerY;
        this.dragVX = this.dragVX * 0.7 + dx * 0.3;
        this.dragVY = this.dragVY * 0.7 + dy * 0.3;
        this.lastPointerX = this.pointerX;
        this.lastPointerY = this.pointerY;

        const dragged = next.find((b) => b.id === this.draggingId);
        if (dragged) {
          const localX = this.pointerX - rect.left;
          const localY = this.pointerY - rect.top;
          dragged.x = Math.max(dragged.radius, Math.min(this.width - dragged.radius, localX));
          dragged.y = Math.max(dragged.radius, Math.min(this.height - dragged.radius, localY));
        }
      }

      // Integrate physics for non-dragged bubbles
      for (let idx = 0; idx < next.length; idx++) {
        const b = next[idx];

        // keep radius in sync with the eased scale factor
        const level = skillsList[idx]?.level;
        b.radius = this.radiusForLevel(level, this.currentScale);

        if (b.dragging) continue;

        // Smooth, slowly-wandering idle motion: the heading meanders a
        // little each frame, and velocity gently steers toward it. This
        // reads as calm floating rather than jittery random-walk noise.
        b.driftAngle += (Math.random() - 0.5) * this.IDLE_WANDER * dt;
        const driftVX = Math.cos(b.driftAngle) * this.IDLE_SPEED;
        const driftVY = Math.sin(b.driftAngle) * this.IDLE_SPEED;
        b.vx += (driftVX - b.vx) * Math.min(this.IDLE_STEER * dt, 1);
        b.vy += (driftVY - b.vy) * Math.min(this.IDLE_STEER * dt, 1);

        b.vx *= Math.pow(this.DAMPING, dt);
        b.vy *= Math.pow(this.DAMPING, dt);

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // wall collisions
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = Math.abs(b.vx) * this.RESTITUTION;
        } else if (b.x + b.radius > this.width) {
          b.x = this.width - b.radius;
          b.vx = -Math.abs(b.vx) * this.RESTITUTION;
        }
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = Math.abs(b.vy) * this.RESTITUTION;
        } else if (b.y + b.radius > this.height) {
          b.y = this.height - b.radius;
          b.vy = -Math.abs(b.vy) * this.RESTITUTION;
        }
      }

      // bubble-bubble collisions (simple elastic circle response)
      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const a = next[i];
          const b = next[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minDist = a.radius + b.radius;
          if (dist < minDist) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            if (!a.dragging) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            }
            if (!b.dragging) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            }
            const relVX = b.vx - a.vx;
            const relVY = b.vy - a.vy;
            const speed = relVX * nx + relVY * ny;
            if (speed < 0) {
              const impulse = speed * this.RESTITUTION;
              if (!a.dragging) {
                a.vx += impulse * nx;
                a.vy += impulse * ny;
              }
              if (!b.dragging) {
                b.vx -= impulse * nx;
                b.vy -= impulse * ny;
              }
            }
          }
        }
      }

      this.bubbles.set(next);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
