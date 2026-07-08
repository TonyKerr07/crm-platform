// ─── Paginação ─────────────────────────────────────────────
export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ─── Cliente ───────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  document?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRequest {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  document?: string;
  notes?: string;
}

// ─── Lead ──────────────────────────────────────────────────
export type LeadStatus =
  | 'NOVO' | 'CONTATO' | 'QUALIFICADO'
  | 'PROPOSTA' | 'NEGOCIACAO' | 'GANHO' | 'PERDIDO';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  status: LeadStatus;
  statusLabel: string;
  estimatedValue?: number;
  notes?: string;
  responsible?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadRequest {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  status?: LeadStatus;
  estimatedValue?: number;
  notes?: string;
  responsible?: string;
}

// ─── Tarefa ────────────────────────────────────────────────
export type TaskStatus = 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  statusLabel: string;
  dueDate?: string;
  overdue: boolean;
  assignedTo?: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
  clientId: string;
}

// ─── Dashboard ─────────────────────────────────────────────
export interface AiInsight {
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  icon: string;
}

export interface DashboardData {
  totalClients: number;
  activeClients: number;
  totalLeads: number;
  openTasks: number;
  overdueTasks: number;
  leadsByStatus: Record<string, number>;
  newClientsThisMonth: number;
  clientGrowthPercent: number;
  aiInsights: AiInsight[];
}
