"""Message routes."""
from flask import Blueprint, request, jsonify
from backend.app import db
from backend.models.message import Message
from backend.routes.auth import token_required, admin_required

messages_bp = Blueprint('messages', __name__)


@messages_bp.route('', methods=['GET'])
@token_required
def get_messages(current_user):
    """Get messages for current user or all messages if admin."""
    if current_user.role == 'admin':
        messages = Message.query.order_by(Message.created_at.desc()).all()
    else:
        messages = Message.query.filter_by(user_id=current_user.id).order_by(Message.created_at.desc()).all()
    
    return jsonify([message.to_dict() for message in messages]), 200


@messages_bp.route('', methods=['POST'])
@token_required
def create_message(current_user):
    """Create a new message."""
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'error': 'Content required'}), 400
    
    message = Message(
        user_id=current_user.id,
        content=data['content']
    )
    
    db.session.add(message)
    db.session.commit()
    
    return jsonify(message.to_dict()), 201


@messages_bp.route('/<int:message_id>/response', methods=['PUT'])
@admin_required
def respond_to_message(current_user, message_id):
    """Admin response to a message."""
    message = Message.query.get_or_404(message_id)
    data = request.get_json()
    
    if not data or not data.get('adminResponse'):
        return jsonify({'error': 'Admin response required'}), 400
    
    message.admin_response = data['adminResponse']
    message.read = True
    
    db.session.commit()
    
    return jsonify(message.to_dict()), 200


@messages_bp.route('/<int:message_id>/read', methods=['PUT'])
@admin_required
def mark_message_read(current_user, message_id):
    """Mark message as read (admin only)."""
    message = Message.query.get_or_404(message_id)
    message.read = True
    
    db.session.commit()
    
    return jsonify(message.to_dict()), 200



