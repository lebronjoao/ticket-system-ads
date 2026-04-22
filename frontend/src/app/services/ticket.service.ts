import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, AnaliseResponse, Stats } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getTickets(status?: string, prioridade?: string): Observable<Ticket[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (prioridade) params = params.set('prioridade', prioridade);
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, { params });
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, ticket);
  }

  updateTicket(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/${id}`);
  }

  analisarTicket(id: number): Observable<AnaliseResponse> {
    return this.http.post<AnaliseResponse>(`${this.apiUrl}/tickets/${id}/analisar`, {});
  }

  gerarResposta(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tickets/${id}/gerar-resposta`, {});
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats`);
  }
}