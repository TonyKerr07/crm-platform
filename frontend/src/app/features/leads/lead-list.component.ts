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
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Lead, LeadStatus } from '../../shared/models/models';
import { LeadService } from '../../core/services/api.service';
import { LeadFormDialogComponent } from './lead-form-dialog.component';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatPaginatorModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatChipsModule, MatMenuModule,
    MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title"><mat-icon>trending_up</mat-icon> Leads</h1>
          <p class="page-subtitle">{{ totalElements }} lead(s) encontrado(s)</p>
        </div>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Novo Lead
        </button>
      </div>

      <!-- Filtros -->
      <mat-card class="filters-card">
        <mat-form-field appearance="outline">
          <mat-label>Buscar</mat-label>
          <input matInput [(ngModel)]="search" (input)="onSearch()" placeholder="Nome, email, empresa...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()">
            <mat-option [value]="null">Todos</mat-option>
            <mat-option *ngFor="let s of statusOptions" [value]="s.value">{{ s.label }}</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card>

      <!-- Tabela -->
      <mat-card class="table-card">
        <div *ngIf="loading" class="loading-overlay"><mat-spinner diameter="40"></mat-spinner></div>

        <table mat-table [dataSource]="leads" class="full-width">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Lead</th>
            <td mat-cell *matCellDef="let l">
              <div class="cell-name">{{ l.name }}</div>
              <div class="cell-sub">{{ l.companyName }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let l">{{ l.email || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let l">
              <span class="status-chip" [class]="'status-' + l.status.toLowerCase()">
                {{ l.statusLabel }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Valor Est.</th>
            <td mat-cell *matCellDef="let l">
              {{ l.estimatedValue != null ? (l.estimatedValue | currency:'BRL':'symbol':'1.0-0') : '—' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="responsible">
            <th mat-header-cell *matHeaderCellDef>Responsável</th>
            <td mat-cell *matCellDef="let l">{{ l.responsible || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let l">
              <button mat-icon-button [matMenuTriggerFor]="statusMenu" matTooltip="Mover no funil">
                <mat-icon>swap_horiz</mat-icon>
              </button>
              <mat-menu #statusMenu="matMenu">
                <button mat-menu-item *ngFor="let s of statusOptions" (click)="updateStatus(l, s.value)">
                  <span class="status-chip" [class]="'status-' + s.value.toLowerCase()">{{ s.label }}</span>
                </button>
              </mat-menu>
              <button mat-icon-button color="primary" matTooltip="Editar" (click)="openForm(l)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" matTooltip="Deletar" (click)="delete(l)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-row" [attr.colspan]="columns.length">
              Nenhum lead encontrado.
            </td>
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
    .filters-card { margin-bottom: 16px; padding: 16px; border-radius: 10px !important; display: flex; gap: 16px; flex-wrap: wrap; }
    .filters-card mat-form-field { min-width: 200px; }
    .table-card { border-radius: 10px !important; position: relative; overflow: hidden; }
    .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
    .full-width { width: 100%; }
    .table-row:hover { background: #f8fafc; }
    .cell-name { font-weight: 500; color: #1e293b; }
    .cell-sub { font-size: 12px; color: #94a3b8; }
    .empty-row { text-align: center; padding: 40px; color: #94a3b8; }
    .status-chip { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .status-novo        { background: #e0e7ff; color: #3730a3; }
    .status-contato     { background: #dbeafe; color: #1e40af; }
    .status-qualificado { background: #d1fae5; color: #065f46; }
    .status-proposta    { background: #fef3c7; color: #92400e; }
    .status-negociacao  { background: #ede9fe; color: #5b21b6; }
    .status-ganho       { background: #dcfce7; color: #166534; }
    .status-perdido     { background: #fee2e2; color: #991b1b; }
  `]
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];
  columns = ['name', 'email', 'status', 'value', 'responsible', 'actions'];
  loading = false;
  search = '';
  statusFilter: LeadStatus | null = null;
  page = 0;
  pageSize = 10;
  totalElements = 0;
  private searchTimer: any;

  statusOptions: { value: LeadStatus; label: string }[] = [
    { value: 'NOVO', label: 'Novo' },
    { value: 'CONTATO', label: 'Em Contato' },
    { value: 'QUALIFICADO', label: 'Qualificado' },
    { value: 'PROPOSTA', label: 'Proposta' },
    { value: 'NEGOCIACAO', label: 'Negociação' },
    { value: 'GANHO', label: 'Ganho' },
    { value: 'PERDIDO', label: 'Perdido' }
  ];

  constructor(
    private leadService: LeadService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.leadService.findAll(
      this.search || undefined,
      this.statusFilter ?? undefined,
      this.page, this.pageSize
    ).subscribe({
      next: res => { this.leads = res.content; this.totalElements = res.totalElements; this.loading = false; },
      error: () => { this.loading = false; this.snackBar.open('Erro ao carregar leads.', 'Fechar', { duration: 3000 }); }
    });
  }

  onSearch(): void { clearTimeout(this.searchTimer); this.searchTimer = setTimeout(() => { this.page = 0; this.load(); }, 400); }
  onFilterChange(): void { this.page = 0; this.load(); }
  onPage(e: PageEvent): void { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  openForm(lead?: Lead): void {
    this.dialog.open(LeadFormDialogComponent, { width: '560px', data: { lead } })
      .afterClosed().subscribe(saved => { if (saved) this.load(); });
  }

  updateStatus(lead: Lead, status: LeadStatus): void {
    this.leadService.updateStatus(lead.id, status).subscribe({
      next: () => { this.snackBar.open('Status atualizado!', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snackBar.open('Erro ao atualizar status.', 'Fechar', { duration: 3000 })
    });
  }

  delete(lead: Lead): void {
    if (!confirm(`Deletar lead "${lead.name}"?`)) return;
    this.leadService.delete(lead.id).subscribe({
      next: () => { this.snackBar.open('Lead removido.', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snackBar.open('Erro ao deletar.', 'Fechar', { duration: 3000 })
    });
  }
}
