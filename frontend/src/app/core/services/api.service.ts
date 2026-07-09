import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Client, ClientRequest, Lead, LeadRequest, LeadStatus,
  Task, TaskRequest, TaskStatus, DashboardData, Page
} from '../../shared/models/models';

// ─── Base URL ──────────────────────────────────────────────
const API = environment.apiUrl;

// ══════════════════════════════════════════════════════════
// Dashboard Service
// ══════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${API}/dashboard`);
  }
}

// ══════════════════════════════════════════════════════════
// Client Service
// ══════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  findAll(search?: string, page = 0, size = 10): Observable<Page<Client>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', 'name')
      .set('sortDir', 'asc');
    if (search) params = params.set('search', search);
    return this.http.get<Page<Client>>(`${API}/clients`, { params });
  }

  findById(id: string): Observable<Client> {
    return this.http.get<Client>(`${API}/clients/${id}`);
  }

  create(request: ClientRequest): Observable<Client> {
    return this.http.post<Client>(`${API}/clients`, request);
  }

  update(id: string, request: ClientRequest): Observable<Client> {
    return this.http.put<Client>(`${API}/clients/${id}`, request);
  }

  deactivate(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/clients/${id}`);
  }
}

// ══════════════════════════════════════════════════════════
// Lead Service
// ══════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class LeadService {
  constructor(private http: HttpClient) {}

  findAll(search?: string, status?: LeadStatus, page = 0, size = 10): Observable<Page<Lead>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<Page<Lead>>(`${API}/leads`, { params });
  }

  create(request: LeadRequest): Observable<Lead> {
    return this.http.post<Lead>(`${API}/leads`, request);
  }

  update(id: string, request: LeadRequest): Observable<Lead> {
    return this.http.put<Lead>(`${API}/leads/${id}`, request);
  }

  updateStatus(id: string, status: LeadStatus): Observable<Lead> {
    return this.http.patch<Lead>(`${API}/leads/${id}/status`, null, {
      params: new HttpParams().set('status', status)
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/leads/${id}`);
  }
}

// ══════════════════════════════════════════════════════════
// Task Service
// ══════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  findAll(clientId?: string, status?: TaskStatus, page = 0, size = 10): Observable<Page<Task>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (clientId) params = params.set('clientId', clientId);
    if (status) params = params.set('status', status);
    return this.http.get<Page<Task>>(`${API}/tasks`, { params });
  }

  create(request: TaskRequest): Observable<Task> {
    return this.http.post<Task>(`${API}/tasks`, request);
  }

  update(id: string, request: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${API}/tasks/${id}`, request);
  }

  complete(id: string): Observable<Task> {
    return this.http.patch<Task>(`${API}/tasks/${id}/complete`, null);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/tasks/${id}`);
  }
}
