import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Client } from '../../shared/models/models';
import { ClientService } from '../../core/services/api.service';

@Component({
  selector: 'app-client-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatProgressBarModule
  ],
  template: `
    <mat-progress-bar *ngIf="saving" mode="indeterminate"></mat-progress-bar>

    <h2 mat-dialog-title>
      <mat-icon>{{ isEdit ? 'edit' : 'person_add' }}</mat-icon>
      {{ isEdit ? 'Editar Cliente' : 'Novo Cliente' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome *</mat-label>
          <input matInput formControlName="name" placeholder="Nome completo">
          <mat-error *ngIf="form.get('name')?.hasError('required')">Nome é obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email *</mat-label>
          <input matInput formControlName="email" placeholder="email@empresa.com" type="email">
          <mat-error *ngIf="form.get('email')?.hasError('required')">Email é obrigatório</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">Email inválido</mat-error>
        </mat-form-field>

        <div class="two-cols">
          <mat-form-field appearance="outline">
            <mat-label>Telefone</mat-label>
            <input matInput formControlName="phone" placeholder="(11) 99999-0000">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>CPF / CNPJ</mat-label>
            <input matInput formControlName="document" placeholder="000.000.000-00">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Empresa</mat-label>
          <input matInput formControlName="companyName" placeholder="Nome da empresa">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observações</mat-label>
          <textarea matInput formControlName="notes" rows="3" placeholder="Notas adicionais..."></textarea>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="saving">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        <mat-icon>save</mat-icon> {{ saving ? 'Salvando...' : 'Salvar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
    .full-width { width: 100%; }
    .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    h2 { display: flex; align-items: center; gap: 8px; }
  `]
})
export class ClientFormDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ClientFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client?: Client }
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.client;
    const c = this.data?.client;

    this.form = this.fb.group({
      name:        [c?.name ?? '',        [Validators.required, Validators.maxLength(150)]],
      email:       [c?.email ?? '',       [Validators.required, Validators.email]],
      phone:       [c?.phone ?? '',       Validators.maxLength(30)],
      companyName: [c?.companyName ?? '', Validators.maxLength(200)],
      document:    [c?.document ?? '',    Validators.maxLength(30)],
      notes:       [c?.notes ?? '']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const request = this.form.value;
    const action = this.isEdit
      ? this.clientService.update(this.data.client!.id, request)
      : this.clientService.create(request);

    action.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Cliente atualizado!' : 'Cliente criado!',
          'OK', { duration: 2500 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.detail ?? 'Erro ao salvar. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 4000 });
      }
    });
  }
}
