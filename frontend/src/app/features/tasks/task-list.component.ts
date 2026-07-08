import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Task, TaskStatus } from '../../shared/models/models';
import { TaskService } from '../../core/services/api.service';
import { TaskFormDialogComponent } from './task-form-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatPaginatorModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatChipsModule,
    MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule,
    MatTooltipModule, MatBadgeModule
  ],
  template: `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title"><mat-icon>task_alt</mat-icon> Tarefas</h1>
          <p class="page-subtitle">{{ totalElements }} tarefa(s)</p>
        </div>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nova Tarefa
        </button>
      </div>

      <!-- Filtros -->
      <mat-card class="filters-card">
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (ngModelChange)="load()">
            <mat-option [value]="null">Todos</mat-option>
            <mat-option value="ABERTA">Aberta</mat-option>
            <mat-option value="EM_ANDAMENTO">Em Andamento</mat-option>
            <mat-option value="CONCLUIDA">Concluída</mat-option>
            <mat-option value="CANCELADA">Cancelada</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card>

      <!-- Tabela -->
      <mat-card class="table-card">
        <div *ngIf="loading" class="loading-overlay"><mat-spinner diameter="40"></mat-spinner></div>

        <table mat-table [dataSource]="tasks" class="full-width">

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Tarefa</th>
            <td mat-cell *matCellDef="let t">
              <div class="cell-name" [class.task-done]="t.status === 'CONCLUIDA'">{{ t.title }}</div>
              <div class="cell-sub">{{ t.description }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="client">
            <th mat-header-cell *matHeaderCellDef>Cliente</th>
            <td mat-cell *matCellDef="let t">{{ t.clientName }}</td>
          </ng-container>

          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Prazo</th>
            <td mat-cell *matCellDef="let t">
              <span [class.overdue-text]="t.overdue">
                <mat-icon *ngIf="t.overdue" class="overdue-icon">warning</mat-icon>
                {{ t.dueDate ? (t.dueDate | date:'dd/MM/yyyy') : '—' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let t">
              <span class="status-chip" [class]="'status-' + t.status.toLowerCase()">
                {{ t.statusLabel }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="assigned">
            <th mat-header-cell *matHeaderCellDef>Responsável</th>
            <td mat-cell *matCellDef="let t">{{ t.assignedTo || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let t">
              <button mat-icon-button color="primary"
                *ngIf="t.status !== 'CONCLUIDA' && t.status !== 'CANCELADA'"
                matTooltip="Marcar como concluída"
                (click)="complete(t)">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-icon-button color="accent" matTooltip="Editar" (click)="openForm(t)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" matTooltip="Deletar" (click)="delete(t)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-row" [attr.colspan]="columns.length">Nenhuma tarefa encontrada.</td>
          </tr>
        </table>

        <mat-paginator [length]="totalElements" [pageSize]="pageSize"
          [pageSizeOptions]="[5,10,20]" (page)="onPage($event)" showFirstLastButtons>
        </mat-paginator>
      </mat-card>

    </div>
  `,
  styles: [`
    .page-container { max-width: 1100px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .page-title { display: flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 600; color: #1e293b; margin: 0; }
    .page-subtitle { font-size: 13px; color: #64748b; margin: 4px 0 0; }
    .filters-card { margin-bottom: 16px; padding: 16px; border-radius: 10px !important; }
    .table-card { border-radius: 10px !important; position: relative; overflow: hidden; }
    .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
    .full-width { width: 100%; }
    .table-row:hover { background: #f8fafc; }
    .cell-name { font-weight: 500; color: #1e293b; }
    .cell-sub { font-size: 12px; color: #94a3b8; }
    .task-done { text-decoration: line-through; opacity: 0.5; }
    .empty-row { text-align: center; padding: 40px; color: #94a3b8; }
    .overdue-text { color: #ef4444; font-weight: 600; display: flex; align-items: center; gap: 2px; }
    .overdue-icon { font-size: 14px; width: 14px; height: 14px; }
    .status-chip { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-aberta      { background: #dbeafe; color: #1e40af; }
    .status-em_andamento { background: #fef3c7; color: #92400e; }
    .status-concluida   { background: #dcfce7; color: #166534; }
    .status-cancelada   { background: #f1f5f9; color: #64748b; }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  columns = ['title', 'client', 'dueDate', 'status', 'assigned', 'actions'];
  loading = false;
  statusFilter: TaskStatus | null = null;
  page = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.taskService.findAll(undefined, this.statusFilter ?? undefined, this.page, this.pageSize)
      .subscribe({
        next: res => { this.tasks = res.content; this.totalElements = res.totalElements; this.loading = false; },
        error: () => { this.loading = false; this.snackBar.open('Erro ao carregar tarefas.', 'Fechar', { duration: 3000 }); }
      });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  openForm(task?: Task): void {
    this.dialog.open(TaskFormDialogComponent, { width: '520px', data: { task } })
      .afterClosed().subscribe(saved => { if (saved) this.load(); });
  }

  complete(task: Task): void {
    this.taskService.complete(task.id).subscribe({
      next: () => { this.snackBar.open('Tarefa concluída! ✅', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snackBar.open('Erro ao concluir.', 'Fechar', { duration: 3000 })
    });
  }

  delete(task: Task): void {
    if (!confirm(`Deletar a tarefa "${task.title}"?`)) return;
    this.taskService.delete(task.id).subscribe({
      next: () => { this.snackBar.open('Tarefa removida.', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snackBar.open('Erro ao deletar.', 'Fechar', { duration: 3000 })
    });
  }
}
