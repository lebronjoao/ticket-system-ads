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
    <div class="container-fluid py-4 bg-light min-vh-100">
      <!-- Header -->
      <div class="row mb-4 align-items-center">
        <div class="col-md-6">
          <div class="d-flex align-items-center">
            <div class="bg-primary text-white rounded-3 p-3 me-3 shadow-sm">
              <i class="bi bi-ticket-perforated-fill fs-3"></i>
            </div>
            <div>
              <h1 class="h3 mb-0 fw-bold">Suporte ADS Tênis</h1>
              <p class="text-muted mb-0">Gestão Inteligente de Tickets</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 text-md-end mt-3 mt-md-0">
          <button class="btn btn-primary shadow-sm px-4" (click)="showCreateModal = true">
            <i class="bi bi-plus-lg me-2"></i>Novo Ticket
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row g-3 mb-4">
        <div class="col-md-2" *ngFor="let s of [
          { label: 'Total', value: stats.total, color: 'primary', icon: 'bi-grid' },
          { label: 'Abertos', value: stats.aberto, color: 'warning', icon: 'bi-envelope' },
          { label: 'Andamento', value: stats.em_andamento, color: 'info', icon: 'bi-clock' },
          { label: 'Resolvidos', value: stats.resolvido, color: 'success', icon: 'bi-check-circle' },
          { label: 'Fechados', value: stats.fechado, color: 'secondary', icon: 'bi-archive' }
        ]">
          <div class="card h-100 border-0 shadow-sm overflow-hidden">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted small fw-medium mb-1">{{ s.label }}</p>
                  <h3 class="mb-0 fw-bold">{{ s.value }}</h3>
                </div>
                <div [class]="'bg-' + s.color + '-subtle text-' + s.color + ' rounded-circle p-2'">
                  <i [class]="'bi ' + s.icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools & Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-3">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" class="form-control border-start-0" placeholder="Buscar ticket ou cliente..." [(ngModel)]="searchTerm" (input)="filterTickets()">
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filtroStatus" (change)="loadTickets()">
                <option value="">Status: Todos</option>
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filtroPrioridade" (change)="loadTickets()">
                <option value="">Prioridade: Todas</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-outline-secondary w-100" (click)="loadTickets()">
                <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-4">Ticket</th>
                  <th>Cliente</th>
                  <th>Categoria</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ticket of filteredTickets">
                  <td class="ps-4">
                    <div class="fw-bold text-primary">#{{ ticket.id }}</div>
                    <div class="small text-truncate" style="max-width: 200px;">{{ ticket.titulo }}</div>
                  </td>
                  <td>
                    <div class="fw-medium">{{ ticket.cliente_nome }}</div>
                    <div class="small text-muted">{{ ticket.cliente_email }}</div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border"><i class="bi bi-tag me-1 text-muted"></i>{{ ticket.categoria }}</span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success-subtle text-success': ticket.prioridade === 'baixa',
                      'bg-warning-subtle text-warning': ticket.prioridade === 'media',
                      'bg-danger-subtle text-danger': ticket.prioridade === 'alta' || ticket.prioridade === 'critica'
                    }">
                      <i class="bi bi-lightning-fill me-1"></i>{{ ticket.prioridade }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-warning': ticket.status === 'aberto',
                      'bg-info': ticket.status === 'em_andamento',
                      'bg-success': ticket.status === 'resolvido',
                      'bg-secondary text-white': ticket.status === 'fechado'
                    }">{{ ticket.status }}</span>
                  </td>
                  <td class="small text-muted">{{ ticket.created_at | date:'dd/MM/yy' }}</td>
                  <td class="text-end pe-4">
                    <div class="btn-group shadow-sm">
                      <button class="btn btn-sm btn-white border" (click)="viewTicket(ticket)" title="Visualizar">
                        <i class="bi bi-eye text-primary"></i>
                      </button>
                      <button class="btn btn-sm btn-white border" (click)="deleteTicket(ticket)" title="Excluir">
                        <i class="bi bi-trash text-danger"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="filteredTickets.length === 0" class="p-5 text-center">
            <i class="bi bi-inbox fs-1 text-muted"></i>
            <p class="text-muted mt-2">Nenhum ticket encontrado</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Novo Ticket -->
    <div class="modal fade" [class.show]="showCreateModal" [style.display]="showCreateModal ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg border-0">
          <div class="modal-header border-0 bg-primary text-white rounded-top-4">
            <h5 class="modal-title fw-bold"><i class="bi bi-plus-circle me-2"></i>Novo Ticket de Suporte</h5>
            <button type="button" class="btn-close btn-close-white" (click)="showCreateModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">TÍTULO DO PROBLEMA</label>
              <input type="text" class="form-control form-control-lg bg-light border-0 shadow-none" placeholder="Ex: Sola descolada" [(ngModel)]="newTicket.titulo">
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">DESCRIÇÃO DETALHADA</label>
              <textarea class="form-control bg-light border-0 shadow-none" rows="3" placeholder="Descreva o que aconteceu..." [(ngModel)]="newTicket.descricao"></textarea>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold text-muted">NOME DO CLIENTE</label>
                <input type="text" class="form-control bg-light border-0 shadow-none" [(ngModel)]="newTicket.cliente_nome">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold text-muted">EMAIL</label>
                <input type="email" class="form-control bg-light border-0 shadow-none" [(ngModel)]="newTicket.cliente_email">
              </div>
            </div>
            <div class="mb-0">
              <label class="form-label small fw-bold text-muted">CATEGORIA</label>
              <select class="form-select bg-light border-0 shadow-none" [(ngModel)]="newTicket.categoria">
                <option value="produto">Produto</option>
                <option value="pagamento">Pagamento</option>
                <option value="entrega">Entrega</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
          <div class="modal-footer border-0 p-4 pt-0">
            <button type="button" class="btn btn-light px-4" (click)="showCreateModal = false">Cancelar</button>
            <button type="button" class="btn btn-primary px-4 shadow-sm" (click)="createTicket()">Criar Ticket</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Ticket -->
    <div class="modal fade" [class.show]="showDetailModal" [style.display]="showDetailModal ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-dark text-white border-0">
            <h5 class="modal-title"><i class="bi bi-info-circle me-2"></i>Detalhes do Ticket #{{ selectedTicket?.id }}</h5>
            <button type="button" class="btn-close btn-close-white" (click)="showDetailModal = false"></button>
          </div>
          <div class="modal-body p-4 bg-light" *ngIf="selectedTicket">
            <div class="row g-3">
              <!-- Left Column: Info -->
              <div class="col-md-5">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body">
                    <div class="mb-4 text-center">
                      <div class="avatar bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 64px; height: 64px;">
                        <i class="bi bi-person-fill fs-2"></i>
                      </div>
                      <h5 class="mb-0 fw-bold">{{ selectedTicket.cliente_nome }}</h5>
                      <p class="text-muted small">{{ selectedTicket.cliente_email }}</p>
                    </div>
                    
                    <div class="mb-3">
                      <label class="small text-muted d-block">STATUS ATUAL</label>
                      <select class="form-select form-select-sm mt-1" [(ngModel)]="selectedTicket.status">
                        <option value="aberto">Aberto</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="resolvido">Resolvido</option>
                        <option value="fechado">Fechado</option>
                      </select>
                    </div>
                    
                    <div class="mb-0">
                      <label class="small text-muted d-block">PRIORIDADE</label>
                      <select class="form-select form-select-sm mt-1" [(ngModel)]="selectedTicket.prioridade">
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Description & IA -->
              <div class="col-md-7">
                <div class="card border-0 shadow-sm mb-3">
                  <div class="card-body">
                    <h6 class="fw-bold mb-2">{{ selectedTicket.titulo }}</h6>
                    <p class="mb-0 text-secondary small">{{ selectedTicket.descricao }}</p>
                  </div>
                </div>

                <!-- IA Box -->
                <div class="card border-0 shadow-sm bg-primary text-white mb-3 overflow-hidden">
                  <div class="card-body position-relative">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="mb-0 fw-bold small"><i class="bi bi-stars me-2"></i>Análise Inteligente</h6>
                      <button class="btn btn-sm btn-light py-0 px-2 small" style="font-size: 0.7rem;" (click)="analisarTicket()" [disabled]="analyzing">
                        <span *ngIf="analyzing" class="spinner-border spinner-border-sm me-1" style="width: 10px; height: 10px;"></span>
                        {{ analyzing ? 'Analisando...' : 'Re-analisar' }}
                      </button>
                    </div>
                    <div *ngIf="selectedTicket.analise_ia" class="bg-white bg-opacity-10 p-2 rounded-3 small" style="font-size: 0.8rem;">
                      <pre class="mb-0 text-white" style="white-space: pre-wrap; font-family: inherit;">{{ selectedTicket.analise_ia }}</pre>
                    </div>
                    <div *ngIf="!selectedTicket.analise_ia" class="text-white-50 small" style="font-size: 0.75rem;">
                      Clique em Re-analisar para gerar uma análise automática.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resposta Suggested -->
            <div class="mt-3">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                  <h6 class="mb-0 fw-bold small">Resposta Recomendada</h6>
                  <button class="btn btn-sm btn-outline-primary py-0 px-2 small" style="font-size: 0.75rem;" (click)="copyResponse()">
                    <i class="bi bi-clipboard me-1"></i>Copiar
                  </button>
                </div>
                <div class="card-body">
                  <textarea class="form-control border-0 bg-light small" rows="4" placeholder="Aguardando análise da IA..." [(ngModel)]="resposta"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer bg-light border-0 p-4 pt-0">
            <button type="button" class="btn btn-link text-muted text-decoration-none px-4" (click)="showDetailModal = false">Fechar</button>
            <button type="button" class="btn btn-success px-5 shadow-sm fw-bold" (click)="saveTicket()">
              <i class="bi bi-save me-2"></i>Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar { border: 2px solid #fff; }
    .btn-white { background: #fff; }
    .bg-success-subtle { background-color: #dcfce7; }
    .bg-warning-subtle { background-color: #fef9c3; }
    .bg-danger-subtle { background-color: #fee2e2; }
    .bg-primary-subtle { background-color: #e0e7ff; }
    .badge { font-size: 0.75rem; }
  `]
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  stats: Stats = { total: 0, aberto: 0, em_andamento: 0, resolvido: 0, fechado: 0 };
  
  searchTerm = '';
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
      .subscribe(data => {
        this.tickets = data;
        this.filterTickets();
      });
  }

  filterTickets() {
    if (!this.searchTerm.trim()) {
      this.filteredTickets = [...this.tickets];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTickets = this.tickets.filter(t => 
        t.titulo.toLowerCase().includes(term) || 
        t.cliente_nome.toLowerCase().includes(term) ||
        t.cliente_email.toLowerCase().includes(term)
      );
    }
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
      this.selectedTicket.status = this.selectedTicket.status; // Ensure status is updated from model
      this.selectedTicket.prioridade = this.selectedTicket.prioridade;
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

  copyResponse() {
    if (this.resposta) {
      navigator.clipboard.writeText(this.resposta);
      alert('Resposta copiada para a área de transferência!');
    }
  }
}