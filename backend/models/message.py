"""Message model."""
from datetime import datetime
from backend.app import db


class Message(db.Model):
    """Message model."""
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    admin_response = db.Column(db.Text, nullable=True)
    read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'userId': str(self.user_id),
            'user': self.user.to_dict() if self.user else None,
            'content': self.content,
            'adminResponse': self.admin_response,
            'read': self.read,
            'createdAt': self.created_at.isoformat(),
        }
    
    def __repr__(self):
        return f'<Message {self.id}>'



