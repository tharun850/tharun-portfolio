import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ParallaxDirective, RevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {}
