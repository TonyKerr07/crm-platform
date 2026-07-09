import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
        import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
        import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clients',
    loadComponent: () =>
        import('./features/clients/client-list.component').then(m => m.ClientListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clients/:id',
    loadComponent: () =>
        import('./features/clients/client-detail.component').then(m => m.ClientDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'leads',
    loadComponent: () =>
        import('./features/leads/lead-list.component').then(m => m.LeadListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    loadComponent: () =>
        import('./features/tasks/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'dashboard' }
];