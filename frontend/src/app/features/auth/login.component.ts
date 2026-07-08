import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatIconModule],
    template: `
    <div class="login-page">
      <mat-card class="login-card">

        <div class="login-logo">
          <mat-icon class="logo-icon">hub</mat-icon>
          <h1>CRM Platform</h1>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Usuário</mat-label>
          <input matInput [(ngModel)]="username" placeholder="admin.empresa">
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput [(ngModel)]="password" type="password" placeholder="empresa123">
          <mat-icon matSuffix>lock</mat-icon>
        </mat-form-field>

        <div class="error-msg" *ngIf="error">{{ error }}</div>

        <button mat-raised-button color="primary" class="full-width login-btn" (click)="login()">
          Entrar
        </button>

        <div class="hint">
          <strong>Usuário:</strong> admin.empresa &nbsp;|&nbsp; <strong>Senha:</strong> empresa123
        </div>

      </mat-card>
    </div>
  `,
    styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
    .login-card {
      width: 380px;
      padding: 40px 32px;
      border-radius: 16px !important;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .login-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
    }
    .logo-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #6366f1;
      margin-bottom: 8px;
    }
    h1 { margin: 0; font-size: 24px; font-weight: 700; color: #1e293b; }
    .full-width { width: 100%; }
    .login-btn { height: 48px; font-size: 16px; margin-top: 8px; }
    .error-msg { color: #ef4444; font-size: 13px; text-align: center; }
    .hint { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 12px; }
  `]
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';

    // Usuários válidos (hardcoded para demo local)
    private users: Record<string, string> = {
        'admin.empresa': 'empresa123',
        'usuario.cliente': 'cliente123'
    };

    constructor(private router: Router) {}

    login(): void {
        if (this.users[this.username] === this.password) {
            sessionStorage.setItem('crm_user', this.username);
            this.router.navigate(['/dashboard']);
        } else {
            this.error = 'Usuário ou senha incorretos.';
        }
    }
}