import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
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
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPRESA'] }
  },
  {
    path: 'clients/:id',
    loadComponent: () =>
      import('./features/clients/client-detail.component').then(m => m.ClientDetailComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPRESA'] }
  },
  {
    path: 'leads',
    loadComponent: () =>
      import('./features/leads/lead-list.component').then(m => m.LeadListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPRESA'] }
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPRESA'] }
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/auth/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
