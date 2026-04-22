# Gerenciamento de Tickets - ADS

Sistema de gerenciamento de tickets de suporte para loja de tênis com integração Ollama (LLM).

## Tecnologias

- **Backend:** Flask + SQLite + SQLAlchemy
- **Frontend:** Angular 17 (Standalone Components)
- **LLM:** Ollama (llama3:8b)

## Pré-requisitos

1. Python 3.8+
2. Node.js 18+
3. Ollama instalado e rodando

## Configuração do Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```

O backend estará disponível em `http://localhost:5000`

**Nota:** O banco de dados SQLite será criado automaticamente na primeira execução.

## Configuração do Frontend

```bash
cd frontend
npm install
npm start
```

O frontend estará disponível em `http://localhost:4200`

## Variáveis de Ambiente (Backend)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| OLLAMA_BASE_URL | http://localhost:11434 | URL do Ollama |
| OLLAMA_MODEL | llama3:8b | Modelo a ser usado |

## Funcionalidades

- Criar, editar e excluir tickets
- Filtrar por status e prioridade
- Análise automática de tickets via IA (Ollama)
- Geração de respostas sugeridas
- Dashboard com estatísticas em tempo real
- Banco de dados em memória (SQLite)

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/tickets | Lista tickets |
| GET | /api/tickets/:id | Detalhes do ticket |
| POST | /api/tickets | Cria ticket |
| PUT | /api/tickets/:id | Atualiza ticket |
| DELETE | /api/tickets/:id | Exclui ticket |
| POST | /api/tickets/:id/analisar | Análise via IA |
| GET | /api/stats | Estatísticas |