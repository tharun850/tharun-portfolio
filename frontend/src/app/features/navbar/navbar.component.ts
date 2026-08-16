import {
  Component,
  HostListener,
  inject,
  signal,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  theme = inject(ThemeService);
  scroll = inject(ScrollService);

  links = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Terminal', href: '#terminal', id: 'terminal' },
    { label: 'Resume', href: '#resume', id: 'resume' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  activeSection = signal<string>('home');
  menuOpen = signal(false);

  private sectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const currentId = visibleEntries[0].target.id;
          if (currentId) {
            this.activeSection.set(currentId);
          }
        }
      },
      {
        rootMargin: '-15% 0px -40% 0px',
        threshold: [0.1, 0.3, 0.5, 0.8],
      }
    );

    this.links.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) {
        this.sectionObserver?.observe(el);
      }
    });
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }

  scrollToSection(href: string, ev?: Event): void {
    if (ev) ev.preventDefault();
    this.closeMenu();

    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      this.activeSection.set(targetId);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
