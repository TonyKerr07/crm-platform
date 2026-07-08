import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Lead } from '../../shared/models/models';
import { LeadService } from '../../core/services/api.service';

@Component({
  selector: 'app-lead-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressBarModule
  ],
  template: `
    <mat-progress-bar *ngIf="saving" mode="indeterminate"></mat-progress-bar>
    <h2 mat-dialog-title>
      <mat-icon>{{ isEdit ? 'edit' : 'add_circle' }}</mat-icon>
      {{ isEdit ? 'Editar Lead' : 'Novo Lead' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome *</mat-label>
          <input matInput formControlName="name">
          <mat-error>Nome é obrigatório</mat-error>
        </mat-form-field>

        <div class="two-cols">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Telefone</mat-label>
            <input matInput formControlName="phone">
          </mat-form-field>
        </div>

        <div class="two-cols">
          <mat-form-field appearance="outline">
            <mat-label>Empresa</mat-label>
            <input matInput formControlName="companyName">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Origem</mat-label>
            <input matInput formControlName="source" placeholder="LinkedIn, Site...">
          </mat-form-field>
        </div>

        <div class="two-cols">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="NOVO">Novo</mat-option>
              <mat-option value="CONTATO">Em Contato</mat-option>
              <mat-option value="QUALIFICADO">Qualificado</mat-option>
              <mat-option value="PROPOSTA">Proposta Enviada</mat-option>
              <mat-option value="NEGOCIACAO">Em Negociação</mat-option>
              <mat-option value="GANHO">Ganho</mat-option>
              <mat-option value="PERDIDO">Perdido</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Valor Estimado (R$)</mat-label>
            <input matInput formControlName="estimatedValue" type="number" min="0">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Responsável</mat-label>
          <input matInput formControlName="responsible" placeholder="Nome do vendedor">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observações</mat-label>
          <textarea matInput formControlName="notes" rows="3"></textarea>
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
export class LeadFormDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LeadFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lead?: Lead }
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.lead;
    const l = this.data?.lead;
    this.form = this.fb.group({
      name:           [l?.name ?? '', [Validators.required]],
      email:          [l?.email ?? '', Validators.email],
      phone:          [l?.phone ?? ''],
      companyName:    [l?.companyName ?? ''],
      source:         [l?.source ?? ''],
      status:         [l?.status ?? 'NOVO'],
      estimatedValue: [l?.estimatedValue ?? null],
      responsible:    [l?.responsible ?? ''],
      notes:          [l?.notes ?? '']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const req = this.form.value;
    const action = this.isEdit
      ? this.leadService.update(this.data.lead!.id, req)
      : this.leadService.create(req);

    action.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Lead atualizado!' : 'Lead criado!', 'OK', { duration: 2500 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err?.error?.detail ?? 'Erro ao salvar.', 'Fechar', { duration: 4000 });
      }
    });
  }
}
