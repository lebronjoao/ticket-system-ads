from flask import Blueprint, request, jsonify
from app.models import db
from app.models import Ticket
from app.ollama_service import OllamaService
import json

api = Blueprint('api', __name__, url_prefix='/api')
ollama_service = OllamaService()

@api.route('/tickets', methods=['GET'])
def listar_tickets():
    status = request.args.get('status')
    prioridade = request.args.get('prioridade')
    
    query = Ticket.query
    
    if status:
        query = query.filter_by(status=status)
    if prioridade:
        query = query.filter_by(prioridade=prioridade)
    
    tickets = query.order_by(Ticket.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tickets])

@api.route('/tickets/<int:id>', methods=['GET'])
def get_ticket(id):
    ticket = Ticket.query.get_or_404(id)
    return jsonify(ticket.to_dict())

@api.route('/tickets', methods=['POST'])
def criar_ticket():
    data = request.get_json()
    
    ticket = Ticket(
        titulo=data.get('titulo'),
        descricao=data.get('descricao'),
        categoria=data.get('categoria', 'outro'),
        prioridade=data.get('prioridade', 'media'),
        status='aberto',
        cliente_nome=data.get('cliente_nome'),
        cliente_email=data.get('cliente_email')
    )
    
    db.session.add(ticket)
    db.session.commit()
    
    return jsonify(ticket.to_dict()), 201

@api.route('/tickets/<int:id>', methods=['PUT'])
def atualizar_ticket(id):
    ticket = Ticket.query.get_or_404(id)
    data = request.get_json()
    
    if 'titulo' in data:
        ticket.titulo = data['titulo']
    if 'descricao' in data:
        ticket.descricao = data['descricao']
    if 'categoria' in data:
        ticket.categoria = data['categoria']
    if 'prioridade' in data:
        ticket.prioridade = data['prioridade']
    if 'status' in data:
        ticket.status = data['status']
    if 'resposta' in data:
        ticket.resposta = data['resposta']
    
    db.session.commit()
    
    return jsonify(ticket.to_dict())

@api.route('/tickets/<int:id>', methods=['DELETE'])
def excluir_ticket(id):
    ticket = Ticket.query.get_or_404(id)
    db.session.delete(ticket)
    db.session.commit()
    
    return jsonify({'message': 'Ticket excluído com sucesso'})

@api.route('/tickets/<int:id>/analisar', methods=['POST'])
def analisar_ticket(id):
    ticket = Ticket.query.get_or_404(id)
    
    analise = ollama_service.analisar_ticket(
        ticket.titulo,
        ticket.descricao,
        ticket.cliente_nome,
        ticket.cliente_email
    )
    
    if analise:
        try:
            analise_data = json.loads(analise)
            ticket.analise_ia = analise
            
            if 'categoria' in analise_data:
                ticket.categoria = analise_data['categoria']
            if 'prioridade' in analise_data:
                ticket.prioridade = analise_data['prioridade']
            if 'resposta_sugerida' in analise_data:
                ticket.resposta = analise_data['resposta_sugerida']
            
            db.session.commit()
            
            return jsonify({
                'message': 'Análise concluída',
                'analise': analise_data,
                'ticket': ticket.to_dict()
            })
        except json.JSONDecodeError:
            ticket.analise_ia = analise
            db.session.commit()
            return jsonify({
                'message': 'Análise concluída (formato inválido)',
                'analise_raw': analise,
                'ticket': ticket.to_dict()
            })
    else:
        return jsonify({'error': 'Falha ao conectar com o serviço de IA'}), 500

@api.route('/tickets/<int:id>/gerar-resposta', methods=['POST'])
def gerar_resposta(id):
    ticket = Ticket.query.get_or_404(id)
    
    resposta = ollama_service.gerar_resposta(
        ticket.titulo,
        ticket.descricao
    )
    
    if resposta:
        return jsonify({
            'resposta': resposta,
            'ticket': ticket.to_dict()
        })
    else:
        return jsonify({'error': 'Falha ao gerar resposta'}), 500

@api.route('/stats', methods=['GET'])
def stats():
    total = Ticket.query.count()
    aberto = Ticket.query.filter_by(status='aberto').count()
    em_andamento = Ticket.query.filter_by(status='em_andamento').count()
    resolvido = Ticket.query.filter_by(status='resolvido').count()
    fechado = Ticket.query.filter_by(status='fechado').count()
    
    return jsonify({
        'total': total,
        'aberto': aberto,
        'em_andamento': em_andamento,
        'resolvido': resolvido,
        'fechado': fechado
    })