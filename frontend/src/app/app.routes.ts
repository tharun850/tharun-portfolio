import { Routes } from '@angular/router';

// Single-page portfolio: the routes exist mainly so deep links / browser
// back-forward work with the section anchors used by the navbar.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
];
