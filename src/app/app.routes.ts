import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'demo-wizard' },
  {
    path: 'demo-wizard',
    loadChildren: () =>
      import('./demo-wizard/demo-wizard.module').then(
        (m) => m.DemoWizardModule
      ), // works with lazy loading
  },
];
