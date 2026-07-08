import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-page">
      <mat-icon class="big-icon">lock</mat-icon>
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.<br>
         Entre em contato com o administrador.</p>
      <button mat-raised-button color="primary" (click)="router.navigate(['/dashboard'])">
        <mat-icon>home</mat-icon> Voltar ao Dashboard
      </button>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 60vh; text-align: center; color: #64748b;
    }
    .big-icon { font-size: 80px; width: 80px; height: 80px; color: #cbd5e1; margin-bottom: 16px; }
    h1 { font-size: 28px; color: #1e293b; margin: 0 0 8px; }
    p { font-size: 16px; line-height: 1.7; margin-bottom: 24px; }
  `]
})
export class UnauthorizedComponent {
  constructor(public router: Router) {}
}
