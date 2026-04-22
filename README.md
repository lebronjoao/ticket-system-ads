# 👟 Suporte ADS Tênis - Gestão Inteligente de Tickets

Sistema moderno de gerenciamento de tickets para e-commerce, utilizando Inteligência Artificial (LLM) para análise de sentimentos, priorização automática e sugestão de respostas em tempo real.

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o sistema localmente.

### 1. Pré-requisitos
*   **Python 3.8+**
*   **Node.js 18+**
*   **Ollama** (para a parte de Inteligência Artificial)

---

### 2. Configuração da IA (Ollama)
O sistema utiliza o modelo **Llama 3** para processar os tickets.
1.  Certifique-se de que o **Ollama** está instalado e rodando no seu computador.
2.  Abra um terminal e execute o comando abaixo para baixar e rodar o modelo:
    ```bash
    ollama run llama3:8b
    ```

---

### 3. Rodando o Backend (API)
O backend é construído em **Flask** com banco de dados **SQLite**.
1.  Abra um terminal na pasta `backend`.
2.  Ative o ambiente virtual:
    *   **Windows:** `.\venv\Scripts\activate`
    *   **Linux/Mac:** `source venv/bin/activate`
3.  (Opcional) Instale as dependências se for a primeira vez:
    ```bash
    pip install -r requirements.txt
    ```
4.  Inicie o servidor:
    ```bash
    python run.py
    ```
*O servidor estará disponível em: `http://localhost:5000`*

---

### 4. Rodando o Frontend (Interface)
A interface é construída em **Angular 17** com design moderno.
1.  Abra um terminal na pasta `frontend`.
2.  (Opcional) Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação:
    ```bash
    npm start
    ```
*A interface estará disponível em: `http://localhost:4200`*

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** Angular 17, Bootstrap 5, Bootstrap Icons.
*   **Backend:** Python, Flask, SQLAlchemy.
*   **Banco de Dados:** SQLite (arquivo local criado automaticamente).
*   **IA:** Ollama API (Modelo Llama 3).

## ✨ Funcionalidades Principais
*   ✅ **Dashboard Inteligente:** Métricas em tempo real sobre o status dos tickets.
*   🔍 **Busca em Tempo Real:** Filtre tickets por título, cliente ou email.
*   🤖 **Análise com IA:** Classificação automática de prioridade e categoria via LLM.
*   📝 **Sugestão de Resposta:** Geração automática de respostas profissionais em Português.
*   📋 **Cópia Rápida:** Botão para copiar a resposta sugerida com um clique.

---
*Projeto desenvolvido para a disciplina de ADS.*