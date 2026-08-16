import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TiltHoverDirective } from '../../core/directives/tilt-hover.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, TiltHoverDirective, RevealDirective],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent {
  private sanitizer = inject(DomSanitizer);

  resumePdfUrl = 'assets/resume.pdf';
  safeResumeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.resumePdfUrl);

  previewOpen = signal(false);

  openPreview(): void {
    this.previewOpen.set(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closePreview(): void {
    this.previewOpen.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.previewOpen()) {
      this.closePreview();
    }
  }
}
