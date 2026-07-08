import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Client, Task } from '../../shared/models/models';
import { ClientService, TaskService } from '../../core/services/api.service';
import { TaskFormDialogComponent } from '../tasks/task-form-dialog.component';
import { ClientFormDialogComponent } from './client-form-dialog.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatTableModule, MatChipsModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule, MatTooltipModule
  ],
  template: `
    <div class="detail-page">

      <!-- Voltar -->
      <button mat-button class="back-btn" (click)="router.navigate(['/clients'])">
        <mat-icon>arrow_back</mat-icon> Voltar para Clientes
      </button>

      <div *ngIf="loading" class="flex-center" style="height:60vh">
        <mat-spinner></mat-spinner>
      </div>

      <ng-container *ngIf="!loading && client">

        <!-- Cabeçalho do cliente -->
        <div class="header-row">
          <div class="client-avatar">{{ client.name.charAt(0).toUpperCase() }}</div>
          <div>
            <h1 class="client-name">{{ client.name }}</h1>
            <p class="client-company">{{ client.companyName || 'Sem empresa' }}</p>
            <span class="status-chip" [class]="client.active ? 'chip-active' : 'chip-inactive'">
              {{ client.active ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          <div class="header-actions">
            <button mat-stroked-button color="primary" (click)="editClient()">
              <mat-icon>edit</mat-icon> Editar
            </button>
          </div>
        </div>

        <!-- Informações -->
        <div class="info-grid">
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title><mat-icon>contact_mail</mat-icon> Contato</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="info-row"><mat-icon>email</mat-icon><span>{{ client.email }}</span></div>
              <div class="info-row"><mat-icon>phone</mat-icon><span>{{ client.phone || 'Não informado' }}</span></div>
              <div class="info-row"><mat-icon>badge</mat-icon><span>{{ client.document || 'Não informado' }}</span></div>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title><mat-icon>calendar_today</mat-icon> Datas</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="info-row">
                <mat-icon>add_circle</mat-icon>
                <span>Criado em {{ client.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="info-row">
                <mat-icon>update</mat-icon>
                <span>Atualizado em {{ client.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card notes-card" *ngIf="client.notes">
            <mat-card-header>
              <mat-card-title><mat-icon>notes</mat-icon> Observações</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="notes-text">{{ client.notes }}</p>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Tarefas do cliente -->
        <mat-card class="tasks-card">
          <div class="tasks-header">
            <h2><mat-icon>task_alt</mat-icon> Tarefas ({{ tasks.length }})</h2>
            <button mat-raised-button color="primary" (click)="addTask()">
              <mat-icon>add</mat-icon> Nova Tarefa
            </button>
          </div>

          <table mat-table [dataSource]="tasks" *ngIf="tasks.length > 0">

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Tarefa</th>
              <td mat-cell *matCellDef="let t">
                <span [class.task-done]="t.status === 'CONCLUIDA'">{{ t.title }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let t">
                <span class="status-chip-sm" [class]="'status-' + t.status.toLowerCase()">
                  {{ t.statusLabel }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef>Prazo</th>
              <td mat-cell *matCellDef="let t">
                <span [class.overdue]="t.overdue">
                  {{ t.dueDate ? (t.dueDate | date:'dd/MM/yyyy') : '—' }}
                  <span *ngIf="t.overdue"> ⚠️</span>
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="assignedTo">
              <th mat-header-cell *matHeaderCellDef>Responsável</th>
              <td mat-cell *matCellDef="let t">{{ t.assignedTo || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let t">
                <button mat-icon-button color="primary"
                  *ngIf="t.status !== 'CONCLUIDA' && t.status !== 'CANCELADA'"
                  matTooltip="Concluir"
                  (click)="completeTask(t)">
                  <mat-icon>check_circle</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="taskColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: taskColumns;" class="table-row"></tr>
          </table>

          <div *ngIf="tasks.length === 0" class="empty-tasks">
            <mat-icon>task</mat-icon>
            <p>Nenhuma tarefa ainda. Clique em "Nova Tarefa" para criar.</p>
          </div>
        </mat-card>

      </ng-container>
    </div>
  `,
  styles: [`
    .detail-page { max-width: 1000px; margin: 0 auto; }
    .back-btn { margin-bottom: 16px; color: #64748b; }

    .header-row {
      display: flex; align-items: center; gap: 20px;
      background: white; border-radius: 12px; padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .client-avatar {
      width: 64px; height: 64px; border-radius: 50%;
      background: #6366f1; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 700; flex-shrink: 0;
    }
    .client-name { margin: 0; font-size: 22px; font-weight: 700; color: #1e293b; }
    .client-company { margin: 4px 0 8px; color: #64748b; font-size: 14px; }
    .header-actions { margin-left: auto; }

    .status-chip { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .chip-active   { background: #dcfce7; color: #166534; }
    .chip-inactive { background: #fee2e2; color: #991b1b; }

    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .info-card mat-card-title { display: flex; align-items: center; gap: 6px; font-size: 15px !important; }
    .info-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; color: #475569; font-size: 14px; border-bottom: 1px solid #f8fafc; }
    .info-row mat-icon { font-size: 18px; width: 18px; color: #94a3b8; }
    .notes-text { color: #475569; font-size: 14px; line-height: 1.6; margin: 0; }

    .tasks-card { border-radius: 12px !important; padding: 0 !important; overflow: hidden; }
    .tasks-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
    .tasks-header h2 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 16px; font-weight: 600; }
    table { width: 100%; }
    .table-row:hover { background: #f8fafc; }
    .task-done { text-decoration: line-through; opacity: 0.5; }
    .overdue { color: #ef4444; font-weight: 600; }
    .status-chip-sm { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .status-aberta       { background: #dbeafe; color: #1e40af; }
    .status-em_andamento { background: #fef3c7; color: #92400e; }
    .status-concluida    { background: #dcfce7; color: #166534; }
    .status-cancelada    { background: #f1f5f9; color: #64748b; }
    .empty-tasks { text-align: center; padding: 40px; color: #94a3b8; }
    .empty-tasks mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 12px; }
  `]
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  tasks: Task[] = [];
  taskColumns = ['title', 'status', 'dueDate', 'assignedTo', 'actions'];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private clientService: ClientService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.clientService.findById(id).subscribe({
      next: (c) => {
        this.client = c;
        this.loading = false;
        this.loadTasks(c.id);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Cliente não encontrado.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/clients']);
      }
    });
  }

  loadTasks(clientId: string): void {
    this.taskService.findAll(clientId, undefined, 0, 50).subscribe({
      next: (res) => this.tasks = res.content
    });
  }

  editClient(): void {
    this.dialog.open(ClientFormDialogComponent, {
      width: '520px', data: { client: this.client }
    }).afterClosed().subscribe(saved => {
      if (saved) {
        this.clientService.findById(this.client!.id).subscribe(c => this.client = c);
      }
    });
  }

  addTask(): void {
    this.dialog.open(TaskFormDialogComponent, {
      width: '520px',
      data: { task: { clientId: this.client!.id } as any }
    }).afterClosed().subscribe(saved => {
      if (saved) this.loadTasks(this.client!.id);
    });
  }

  completeTask(task: Task): void {
    this.taskService.complete(task.id).subscribe({
      next: () => {
        this.snackBar.open('Tarefa concluída! ✅', 'OK', { duration: 2000 });
        this.loadTasks(this.client!.id);
      }
    });
  }
}
