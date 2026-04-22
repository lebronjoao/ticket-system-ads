import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-ticket-ads')
    
    # Banco em memória (SQLite)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tickets.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Ollama
    OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
    OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'qwen3-vl:8b')