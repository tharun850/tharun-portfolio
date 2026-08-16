import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // This app runs zoneless: all reactivity comes from signals (theme,
    // scroll position, bubble physics), so no zone.js polyfill is needed.
    // IMPORTANT: if you scaffold with `ng new`, generate it with the
    // --zoneless flag (or remove the zone.js import from polyfills.ts) —
    // Angular throws a bootstrap error if zone.js is loaded at the same
    // time as provideZonelessChangeDetection().
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(withFetch()),
    // No provideAnimations(): all motion here is CSS transitions/keyframes
    // plus the custom rAF-driven parallax/physics, so the Angular
    // animations package isn't needed and would just add dead weight.
  ],
};
