import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, CommonModule,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav mode="side" [opened]="isLoggedIn()" class="sidenav">
        <div class="logo-area">
          <mat-icon class="logo-icon">hub</mat-icon>
          <span class="logo-text">CRM Platform</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/clients" routerLinkActive="active-link">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Clientes</span>
          </a>
          <a mat-list-item routerLink="/leads" routerLinkActive="active-link">
            <mat-icon matListItemIcon>trending_up</mat-icon>
            <span matListItemTitle>Leads</span>
          </a>
          <a mat-list-item routerLink="/tasks" routerLinkActive="active-link">
            <mat-icon matListItemIcon>task_alt</mat-icon>
            <span matListItemTitle>Tarefas</span>
          </a>
        </mat-nav-list>
        <div class="sidenav-footer">
          <button mat-button (click)="logout()" class="logout-btn">
            <mat-icon>logout</mat-icon> Sair
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="top-toolbar" *ngIf="isLoggedIn()">
          <span class="toolbar-title">CRM Platform</span>
          <span class="spacer"></span>
          <span class="username">{{ getUsername() }}</span>
        </mat-toolbar>
        <div [class]="isLoggedIn() ? 'content-area' : 'content-full'">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-container { height: 100vh; }
    .sidenav { width: 240px; background: #1e293b; color: white; display: flex; flex-direction: column; }
    .logo-area { display: flex; align-items: center; gap: 10px; padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo-icon { color: #6366f1; font-size: 28px; }
    .logo-text { font-size: 18px; font-weight: 700; color: white; }
    mat-nav-list { flex: 1; padding-top: 8px; }
    .active-link { background: rgba(99,102,241,0.2) !important; border-left: 3px solid #6366f1; color: #6366f1 !important; }
    mat-list-item { color: rgba(255,255,255,0.75); margin: 2px 8px; border-radius: 6px; }
    .sidenav-footer { padding: 16px; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn { color: rgba(255,255,255,0.6); width: 100%; }
    .top-toolbar { background: #6366f1; }
    .toolbar-title { font-weight: 600; }
    .spacer { flex: 1; }
    .username { font-size: 14px; opacity: 0.9; }
    .content-area { padding: 24px; background: #f1f5f9; min-height: calc(100vh - 64px); overflow-y: auto; }
    .content-full { background: #f1f5f9; min-height: 100vh; }
  `]
})
export class AppComponent {
  constructor(private router: Router) {}
  isLoggedIn(): boolean { return !!sessionStorage.getItem('crm_user'); }
  getUsername(): string { return sessionStorage.getItem('crm_user') || ''; }
  logout(): void { sessionStorage.removeItem('crm_user'); this.router.navigate(['/login']); }
}