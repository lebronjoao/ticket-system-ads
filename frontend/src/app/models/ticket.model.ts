export interface Ticket {
  id?: number;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  status: string;
  analise_ia?: string;
  resposta?: string;
  cliente_nome: string;
  cliente_email: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnaliseResponse {
  message: string;
  analise?: any;
  analise_raw?: string;
  ticket: Ticket;
}

export interface Stats {
  total: number;
  aberto: number;
  em_andamento: number;
  resolvido: number;
  fechado: number;
}