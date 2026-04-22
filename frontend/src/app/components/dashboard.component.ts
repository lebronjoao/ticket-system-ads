import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../services/ticket.service';
import { Ticket, Stats } from '../models/ticket.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h3 mb-0">ADS - Loja de Tênis</h1>
          <p class="text-muted">Sistema de suporte</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
                <div class="col-md-2">
          <button class="btn btn-success btn-lg w-100 h-100" (click)="showCreateModal = true">
            + Novo Ticket
          </button>
        </div>
        <div class="col-md-2">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h5 class="card-title">Total</h5>
              <h2>{{ stats.total }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <h5 class="card-title">Abertos</h5>
              <h2>{{ stats.aberto }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card bg-info text-white">
            <div class="card-body">
              <h5 class="card-title">Em Andamento</h5>
              <h2>{{ stats.em_andamento }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h5 class="card-title">Resolvidos</h5>
              <h2>{{ stats.resolvido }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card bg-secondary text-white">
            <div class="card-body">
              <h5 class="card-title">Fechados</h5>
              <h2>{{ stats.fechado }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-3">
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="filtroStatus" (change)="loadTickets()">
            <option value="">Todos os Status</option>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="resolvido">Resolvido</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="filtroPrioridade" (change)="loadTickets()">
            <option value="">Todas as Prioridades</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>
      </div>

      <!-- Lista de Tickets -->
      <div class="card">
        <div class="card-body">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Cliente</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ticket of tickets" [class.table-warning]="ticket.prioridade === 'alta'" [class.table-danger]="ticket.prioridade === 'critica'">
                <td>#{{ ticket.id }}</td>
                <td>{{ ticket.titulo }}</td>
                <td>{{ ticket.cliente_nome }}</td>
                <td>
                  <span class="badge bg-secondary">{{ ticket.categoria }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': ticket.prioridade === 'baixa',
                    'bg-warning': ticket.prioridade === 'media',
                    'bg-danger': ticket.prioridade === 'alta' || ticket.prioridade === 'critica'
                  }">{{ ticket.prioridade }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-warning': ticket.status === 'aberto',
                    'bg-info': ticket.status === 'em_andamento',
                    'bg-success': ticket.status === 'resolvido',
                    'bg-secondary': ticket.status === 'fechado'
                  }">{{ ticket.status }}</span>
                </td>
                <td>{{ ticket.created_at | date:'dd/MM/yyyy' }}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-1" (click)="viewTicket(ticket)">Ver</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteTicket(ticket)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p *ngIf="tickets.length === 0" class="text-center text-muted">Nenhum ticket encontrado</p>
        </div>
      </div>
    </div>

    <!-- Modal Novo Ticket -->
    <div class="modal fade" [class.show]="showCreateModal" [style.display]="showCreateModal ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Novo Ticket</h5>
            <button type="button" class="btn-close" (click)="showCreateModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Título</label>
              <input type="text" class="form-control" [(ngModel)]="newTicket.titulo">
            </div>
            <div class="mb-3">
              <label class="form-label">Descrição</label>
              <textarea class="form-control" rows="3" [(ngModel)]="newTicket.descricao"></textarea>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nome do Cliente</label>
                <input type="text" class="form-control" [(ngModel)]="newTicket.cliente_nome">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email do Cliente</label>
                <input type="email" class="form-control" [(ngModel)]="newTicket.cliente_email">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Categoria</label>
              <select class="form-select" [(ngModel)]="newTicket.categoria">
                <option value="produto">Produto</option>
                <option value="pagamento">Pagamento</option>
                <option value="entrega">Entrega</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCreateModal = false">Cancelar</button>
            <button type="button" class="btn btn-primary" (click)="createTicket()">Criar Ticket</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Ticket -->
    <div class="modal fade" [class.show]="showDetailModal" [style.display]="showDetailModal ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ticket #{{ selectedTicket?.id }}</h5>
            <button type="button" class="btn-close" (click)="showDetailModal = false"></button>
          </div>
          <div class="modal-body" *ngIf="selectedTicket">
            <div class="row mb-3">
              <div class="col-md-8">
                <h4>{{ selectedTicket.titulo }}</h4>
              </div>
              <div class="col-md-4 text-end">
                <span class="badge bg-warning me-1">{{ selectedTicket.status }}</span>
                <span class="badge bg-danger">{{ selectedTicket.prioridade }}</span>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <strong>Cliente:</strong> {{ selectedTicket.cliente_nome }}
              </div>
              <div class="col-md-6">
                <strong>Email:</strong> {{ selectedTicket.cliente_email }}
              </div>
            </div>

            <div class="mb-3">
              <strong>Categoria:</strong> {{ selectedTicket.categoria }}
            </div>

            <div class="mb-3">
              <strong>Descrição:</strong>
              <p class="mt-1">{{ selectedTicket.descricao }}</p>
            </div>

            <hr>

            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>Análise da IA:</strong>
                <button class="btn btn-sm btn-primary" (click)="analisarTicket()" [disabled]="analyzing">
                  {{ analyzing ? 'Analisando...' : 'Analisar com IA' }}
                </button>
              </div>
              <div *ngIf="selectedTicket.analise_ia" class="bg-light p-3 rounded">
                <pre class="mb-0" style="white-space: pre-wrap;">{{ selectedTicket.analise_ia }}</pre>
              </div>
              <p *ngIf="!selectedTicket.analise_ia" class="text-muted">Nenhuma análise disponível</p>
            </div>

            <div class="mb-3">
              <label class="form-label"><strong>Resposta:</strong></label>
              <textarea class="form-control" rows="4" [(ngModel)]="resposta"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label"><strong>Status:</strong></label>
              <select class="form-select" [(ngModel)]="selectedTicket.status">
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showDetailModal = false">Fechar</button>
            <button type="button" class="btn btn-success" (click)="saveTicket()">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  stats: Stats = { total: 0, aberto: 0, em_andamento: 0, resolvido: 0, fechado: 0 };
  
  filtroStatus = '';
  filtroPrioridade = '';
  
  showCreateModal = false;
  showDetailModal = false;
  selectedTicket: Ticket | null = null;
  resposta = '';
  analyzing = false;

  newTicket: Ticket = {
    titulo: '',
    descricao: '',
    categoria: 'outro',
    prioridade: 'media',
    status: 'aberto',
    cliente_nome: '',
    cliente_email: ''
  };

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
    this.loadStats();
  }

  loadTickets() {
    this.ticketService.getTickets(this.filtroStatus || undefined, this.filtroPrioridade || undefined)
      .subscribe(data => this.tickets = data);
  }

  loadStats() {
    this.ticketService.getStats().subscribe(data => this.stats = data);
  }

  createTicket() {
    this.ticketService.createTicket(this.newTicket).subscribe(() => {
      this.showCreateModal = false;
      this.newTicket = { titulo: '', descricao: '', categoria: 'outro', prioridade: 'media', status:'aberto', cliente_nome: '', cliente_email: '' };
      this.loadTickets();
      this.loadStats();
    });
  }

  viewTicket(ticket: Ticket) {
    this.selectedTicket = { ...ticket };
    this.resposta = ticket.resposta || '';
    this.showDetailModal = true;
  }

  saveTicket() {
    if (this.selectedTicket) {
      this.selectedTicket.resposta = this.resposta;
      this.ticketService.updateTicket(this.selectedTicket.id!, this.selectedTicket).subscribe(() => {
        this.showDetailModal = false;
        this.loadTickets();
        this.loadStats();
      });
    }
  }

  deleteTicket(ticket: Ticket) {
    if (confirm('Tem certeza que deseja excluir este ticket?')) {
      this.ticketService.deleteTicket(ticket.id!).subscribe(() => {
        this.loadTickets();
        this.loadStats();
      });
    }
  }

  analisarTicket() {
    if (this.selectedTicket) {
      this.analyzing = true;
      this.ticketService.analisarTicket(this.selectedTicket.id!).subscribe({
        next: (res) => {
          this.selectedTicket = res.ticket;
          this.resposta = res.ticket.resposta || '';
          this.analyzing = false;
        },
        error: () => {
          this.analyzing = false;
          alert('Erro ao analisar ticket. Verifique se o Ollama está rodando.');
        }
      });
    }
  }
}