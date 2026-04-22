from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(50), default='outro')
    prioridade = db.Column(db.String(20), default='media')
    status = db.Column(db.String(20), default='aberto')
    analise_ia = db.Column(db.Text, nullable=True)
    resposta = db.Column(db.Text, nullable=True)
    cliente_nome = db.Column(db.String(100), nullable=False)
    cliente_email = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'categoria': self.categoria,
            'prioridade': self.prioridade,
            'status': self.status,
            'analise_ia': self.analise_ia,
            'resposta': self.resposta,
            'cliente_nome': self.cliente_nome,
            'cliente_email': self.cliente_email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }