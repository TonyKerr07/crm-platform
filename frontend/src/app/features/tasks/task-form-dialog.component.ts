import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Task } from '../../shared/models/models';
import { TaskService, ClientService } from '../../core/services/api.service';

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule, MatProgressBarModule,
    MatAutocompleteModule
  ],
  template: `
    <mat-progress-bar *ngIf="saving" mode="indeterminate"></mat-progress-bar>
    <h2 mat-dialog-title>
      <mat-icon>{{ isEdit ? 'edit' : 'add_task' }}</mat-icon>
      {{ isEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título *</mat-label>
          <input matInput formControlName="title" placeholder="Descreva a tarefa brevemente">
          <mat-error>Título é obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Detalhes opcionais..."></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cliente *</mat-label>
          <mat-select formControlName="clientId">
            <mat-option *ngFor="let c of clients" [value]="c.id">{{ c.name }}</mat-option>
          </mat-select>
          <mat-error>Selecione um cliente</mat-error>
        </mat-form-field>

        <div class="two-cols">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="ABERTA">Aberta</mat-option>
              <mat-option value="EM_ANDAMENTO">Em Andamento</mat-option>
              <mat-option value="CONCLUIDA">Concluída</mat-option>
              <mat-option value="CANCELADA">Cancelada</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Prazo</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Responsável</mat-label>
          <input matInput formControlName="assignedTo" placeholder="Nome da pessoa responsável">
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
export class TaskFormDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  isEdit = false;
  clients: { id: string; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.task;
    const t = this.data?.task;

    this.form = this.fb.group({
      title:       [t?.title ?? '',       Validators.required],
      description: [t?.description ?? ''],
      clientId:    [t?.clientId ?? '',    Validators.required],
      status:      [t?.status ?? 'ABERTA'],
      dueDate:     [t?.dueDate ? new Date(t.dueDate) : null],
      assignedTo:  [t?.assignedTo ?? '']
    });

    // Carrega lista de clientes para o select
    this.clientService.findAll(undefined, 0, 100).subscribe({
      next: res => this.clients = res.content.map(c => ({ id: c.id, name: c.name }))
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.value;

    // Formata a data para string ISO (yyyy-MM-dd)
    const req = {
      ...raw,
      dueDate: raw.dueDate ? new Date(raw.dueDate).toISOString().split('T')[0] : null
    };

    const action = this.isEdit
      ? this.taskService.update(this.data.task!.id, req)
      : this.taskService.create(req);

    action.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Tarefa atualizada!' : 'Tarefa criada!', 'OK', { duration: 2500 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err?.error?.detail ?? 'Erro ao salvar.', 'Fechar', { duration: 4000 });
      }
    });
  }
}
