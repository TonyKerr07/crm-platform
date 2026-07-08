import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Client, ClientRequest } from '../../shared/models/models';
import { ClientService } from '../../core/services/api.service';
import { ClientFormDialogComponent } from './client-form-dialog.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">

      <!-- Cabeçalho -->
      <div class="page-header">
        <div>
          <h1 class="page-title"><mat-icon>people</mat-icon> Clientes</h1>
          <p class="page-subtitle">{{ totalElements }} cliente(s) encontrado(s)</p>
        </div>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Novo Cliente
        </button>
      </div>

      <!-- Busca -->
      <mat-card class="search-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por nome, email ou empresa</mat-label>
          <input matInput [(ngModel)]="search" (input)="onSearch()" placeholder="Digite para filtrar...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </mat-card>

      <!-- Tabela -->
      <mat-card class="table-card">
        <div *ngIf="loading" class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table mat-table [dataSource]="clients" class="full-width">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let c">
              <div class="cell-name">{{ c.name }}</div>
              <div class="cell-sub">{{ c.companyName }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let c">{{ c.email }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Telefone</th>
            <td mat-cell *matCellDef="let c">{{ c.phone || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c">
              <mat-chip [class]="c.active ? 'chip-active' : 'chip-inactive'">
                {{ c.active ? 'Ativo' : 'Inativo' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button color="primary" matTooltip="Editar" (click)="openForm(c)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" matTooltip="Desativar" (click)="deactivate(c)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-row" [attr.colspan]="columns.length">
              <mat-icon>search_off</mat-icon> Nenhum cliente encontrado.
            </td>
          </tr>
        </table>

        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 20]"
          (page)="onPage($event)"
          showFirstLastButtons>
        </mat-paginator>
      </mat-card>

    </div>
  `,
  styles: [`
    .page-container { max-width: 1100px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .page-title { display: flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 600; color: #1e293b; margin: 0; }
    .page-subtitle { font-size: 13px; color: #64748b; margin: 4px 0 0; }
    .search-card { margin-bottom: 16px; padding: 16px; border-radius: 10px !important; }
    .search-field { width: 100%; }
    .table-card { border-radius: 10px !important; position: relative; overflow: hidden; }
    .loading-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
    .full-width { width: 100%; }
    .table-row:hover { background: #f8fafc; }
    .cell-name { font-weight: 500; color: #1e293b; }
    .cell-sub { font-size: 12px; color: #94a3b8; }
    .chip-active { background: #dcfce7 !important; color: #166534 !important; }
    .chip-inactive { background: #fee2e2 !important; color: #991b1b !important; }
    .empty-row { text-align: center; padding: 40px; color: #94a3b8; }
    .empty-row mat-icon { vertical-align: middle; margin-right: 8px; }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  columns = ['name', 'email', 'phone', 'status', 'actions'];
  loading = false;
  search = '';
  page = 0;
  pageSize = 10;
  totalElements = 0;
  private searchTimer: any;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.clientService.findAll(this.search || undefined, this.page, this.pageSize)
      .subscribe({
        next: (res) => {
          this.clients = res.content;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erro ao carregar clientes.', 'Fechar', { duration: 3000 });
        }
      });
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 0; this.load(); }, 400);
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  openForm(client?: Client): void {
    this.dialog.open(ClientFormDialogComponent, {
      width: '520px', data: { client }
    }).afterClosed().subscribe(saved => { if (saved) this.load(); });
  }

  deactivate(client: Client): void {
    if (!confirm(`Desativar o cliente "${client.name}"?`)) return;
    this.clientService.deactivate(client.id).subscribe({
      next: () => {
        this.snackBar.open('Cliente desativado.', 'OK', { duration: 2500 });
        this.load();
      },
      error: () => this.snackBar.open('Erro ao desativar.', 'Fechar', { duration: 3000 })
    });
  }
}
