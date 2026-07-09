import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/services/api.service';
import { of, throwError } from 'rxjs';
import { DashboardData } from '../../shared/models/models';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  const mockDashboard: DashboardData = {
    totalClients: 10,
    activeClients: 8,
    totalLeads: 15,
    openTasks: 5,
    overdueTasks: 1,
    leadsByStatus: { NOVO: 3, NEGOCIACAO: 4, GANHO: 2, PERDIDO: 1 },
    newClientsThisMonth: 2,
    clientGrowthPercent: 15.5,
    aiInsights: [
      { title: 'Crescimento', message: 'Clientes cresceram 15%', type: 'SUCCESS', icon: '🚀' }
    ]
  };

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['getDashboard']);
    dashboardServiceSpy.getDashboard.and.returnValue(of(mockDashboard));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        { provide: DashboardService, useValue: dashboardServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar dados do dashboard ao iniciar', () => {
    expect(dashboardServiceSpy.getDashboard).toHaveBeenCalledOnceWith();
    expect(component.data).toEqual(mockDashboard);
    expect(component.loading).toBeFalse();
  });

  it('deve mostrar métricas corretas na tela', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('8');  // activeClients
    expect(compiled.textContent).toContain('15'); // totalLeads
    expect(compiled.textContent).toContain('5');  // openTasks
  });

  it('deve parar o loading mesmo se o serviço retornar erro', () => {
    dashboardServiceSpy.getDashboard.and.returnValue(throwError(() => new Error('Erro')));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
  });
});
