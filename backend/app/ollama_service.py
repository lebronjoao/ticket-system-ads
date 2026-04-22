import requests
from app.config import Config

class OllamaService:
    def __init__(self):
        self.base_url = Config.OLLAMA_BASE_URL
        self.model = Config.OLLAMA_MODEL
    
    def analisar_ticket(self, titulo, descricao, cliente_nome, cliente_email):
        prompt = f"""Você é um assistente de suporte para uma loja de tênis chamada "ADS Tênis". 
Analise o seguinte ticket de suporte e forneça uma análise detalhada no formato JSON com os seguintes campos:
1. "categoria": Categoria mais adequada (produto, pagamento, entrega, outro)
2. "prioridade": Prioridade (baixa, media, alta, critica)
3. "resumo": Resumo breve do problema em 1-2 frases
4. "resposta_sugerida": Uma resposta profissional e útil para o cliente (APENAS O TEXTO, sem objetos aninhados)

IMPORTANTE: Responda sempre em Português do Brasil.
Responda APENAS com JSON válido, sem texto adicional.

Ticket:
- Título: {titulo}
- Descrição: {descricao}
- Cliente: {cliente_nome}
- Email: {cliente_email}"""

        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('response', '')
            else:
                return None
        except Exception as e:
            print(f"Erro ao conectar com Ollama: {e}")
            return None
    
    def gerar_resposta(self, titulo, descricao):
        prompt = f"""Você é um assistente de suporte para uma loja de tênis "ADS Tên".
Com base no ticket abaixo, gere uma resposta profissional e útil para o cliente:

Título: {titulo}
Descrição: {descricao}

Forneça uma resposta em tom profissional e prestativo."""

        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('response', '')
            else:
                return None
        except Exception as e:
            print(f"Erro ao conectar com Ollama: {e}")
            return None