import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: 'subscriptions',
    loadComponent: () =>
      import('./features/subscriptions/subscription-list').then((m) => m.SubscriptionListComponent),
  },
  {
    path: 'subscriptions/new',
    loadComponent: () =>
      import('./features/subscriptions/subscription-form').then((m) => m.SubscriptionFormComponent),
  },
  {
    path: 'subscriptions/:id/edit',
    loadComponent: () =>
      import('./features/subscriptions/subscription-form').then((m) => m.SubscriptionFormComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
