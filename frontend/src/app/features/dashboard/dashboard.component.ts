import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from '../../core/services/api.service';
import { DashboardData, AiInsight } from '../../shared/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule,
    MatProgressSpinnerModule, MatChipsModule, NgChartsModule
  ],
  template: `
    <div class="dashboard-page">

      <h1 class="page-title">
        <mat-icon>dashboard</mat-icon> Dashboard
      </h1>

      <div *ngIf="loading" class="loading-center">
        <mat-spinner></mat-spinner>
      </div>

      <ng-container *ngIf="!loading && data">

        <div class="metrics-grid">

          <mat-card class="metric-card metric-blue">
            <mat-icon class="metric-icon">people</mat-icon>
            <div class="metric-content">
              <div class="metric-value">{{ data.activeClients }}</div>
              <div class="metric-label">Clientes Ativos</div>
              <div class="metric-change" [class.positive]="data.clientGrowthPercent > 0"
                   [class.negative]="data.clientGrowthPercent < 0">
                {{ data.clientGrowthPercent > 0 ? '+' : '' }}{{ data.clientGrowthPercent | number:'1.0-0' }}% este mês
              </div>
            </div>
          </mat-card>

          <mat-card class="metric-card metric-green">
            <mat-icon class="metric-icon">trending_up</mat-icon>
            <div class="metric-content">
              <div class="metric-value">{{ data.totalLeads }}</div>
              <div class="metric-label">Leads no Funil</div>
              <div class="metric-sub">{{ data.leadsByStatus['NEGOCIACAO'] || 0 }} em negociação</div>
            </div>
          </mat-card>

          <mat-card class="metric-card" [class.metric-orange]="data.openTasks > 0" [class.metric-success]="data.openTasks === 0">
            <mat-icon class="metric-icon">task_alt</mat-icon>
            <div class="metric-content">
              <div class="metric-value">{{ data.openTasks }}</div>
              <div class="metric-label">Tarefas Abertas</div>
              <div class="metric-sub metric-alert" *ngIf="data.overdueTasks > 0">
                ⚠️ {{ data.overdueTasks }} em atraso
              </div>
            </div>
          </mat-card>

          <mat-card class="metric-card metric-purple">
            <mat-icon class="metric-icon">person_add</mat-icon>
            <div class="metric-content">
              <div class="metric-value">{{ data.newClientsThisMonth }}</div>
              <div class="metric-label">Novos Clientes</div>
              <div class="metric-sub">este mês</div>
            </div>
          </mat-card>

        </div>

        <div class="charts-insights-grid">

          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Funil de Leads</mat-card-title>
              <mat-card-subtitle>Distribuição por status</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="chart-content">
              <canvas baseChart
                [data]="leadsChartData"
                [options]="leadsChartOptions"
                type="doughnut">
              </canvas>
            </mat-card-content>
          </mat-card>

          <div class="insights-column">
            <h2 class="insights-title">
              <mat-icon>auto_awesome</mat-icon> Insights Inteligentes
            </h2>
            <div class="insight-card" *ngFor="let insight of data.aiInsights"
                 [class]="'insight-' + insight.type.toLowerCase()">
              <div class="insight-icon">{{ insight.icon }}</div>
              <div class="insight-body">
                <div class="insight-title">{{ insight.title }}</div>
                <div class="insight-message">{{ insight.message }}</div>
              </div>
            </div>
          </div>

        </div>

      </ng-container>

    </div>
  `,
  styles: [`
    .dashboard-page { max-width: 1200px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 24px; }
    .loading-center { display: flex; justify-content: center; padding: 80px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .metric-card { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 12px !important; border-left: 5px solid; }
    .metric-blue   { border-left-color: #6366f1; background: linear-gradient(135deg, #eef2ff, #fff); }
    .metric-green  { border-left-color: #10b981; background: linear-gradient(135deg, #ecfdf5, #fff); }
    .metric-orange { border-left-color: #f59e0b; background: linear-gradient(135deg, #fffbeb, #fff); }
    .metric-success{ border-left-color: #10b981; background: linear-gradient(135deg, #ecfdf5, #fff); }
    .metric-purple { border-left-color: #8b5cf6; background: linear-gradient(135deg, #f5f3ff, #fff); }
    .metric-icon  { font-size: 36px; width: 36px; height: 36px; opacity: 0.6; }
    .metric-value { font-size: 32px; font-weight: 700; color: #1e293b; line-height: 1; }
    .metric-label { font-size: 13px; color: #64748b; margin-top: 4px; }
    .metric-sub   { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .metric-change { font-size: 12px; font-weight: 600; margin-top: 4px; }
    .metric-change.positive { color: #10b981; }
    .metric-change.negative { color: #ef4444; }
    .metric-alert { color: #f59e0b !important; font-weight: 600; }
    .charts-insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .chart-card { border-radius: 12px !important; }
    .chart-content { max-height: 300px; display: flex; justify-content: center; }
    .insights-title { display: flex; align-items: center; gap: 6px; font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 12px; }
    .insight-card { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid; }
    .insight-info    { background: #eff6ff; border-color: #3b82f6; }
    .insight-success { background: #f0fdf4; border-color: #22c55e; }
    .insight-warning { background: #fffbeb; border-color: #f59e0b; }
    .insight-alert   { background: #fef2f2; border-color: #ef4444; }
    .insight-icon  { font-size: 22px; line-height: 1; }
    .insight-title { font-size: 14px; font-weight: 600; color: #1e293b; }
    .insight-message { font-size: 13px; color: #475569; margin-top: 2px; line-height: 1.5; }
    @media (max-width: 768px) { .charts-insights-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  data: DashboardData | null = null;

  leadsChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  leadsChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.data = data;
        this.buildChart(data);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private buildChart(data: DashboardData): void {
    const statusLabels: Record<string, string> = {
      NOVO: 'Novo', CONTATO: 'Em Contato', QUALIFICADO: 'Qualificado',
      PROPOSTA: 'Proposta', NEGOCIACAO: 'Negociação', GANHO: 'Ganho', PERDIDO: 'Perdido'
    };
    const colors = ['#6366f1','#3b82f6','#10b981','#f59e0b','#8b5cf6','#22c55e','#ef4444'];
    const entries = Object.entries(data.leadsByStatus);
    this.leadsChartData = {
      labels: entries.map(([k]) => statusLabels[k] ?? k),
      datasets: [{ data: entries.map(([, v]) => v), backgroundColor: colors.slice(0, entries.length), hoverOffset: 8 }]
    };
  }
}