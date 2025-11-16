"""Order models."""
from datetime import datetime
from backend.app import db
import json


class Order(db.Model):
    """Order model."""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default='pending', nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)  # JSON stored as text
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def get_shipping_address(self) -> dict:
        """Get shipping address as dict."""
        return json.loads(self.shipping_address) if self.shipping_address else {}
    
    def set_shipping_address(self, address: dict):
        """Set shipping address from dict."""
        self.shipping_address = json.dumps(address)
    
    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'userId': str(self.user_id),
            'items': [item.to_dict() for item in self.items],
            'total': float(self.total),
            'status': self.status,
            'shippingAddress': self.get_shipping_address(),
            'createdAt': self.created_at.isoformat(),
        }
    
    def __repr__(self):
        return f'<Order {self.id}>'


class OrderItem(db.Model):
    """Order item model."""
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Relationships
    product = db.relationship('Product', lazy=True)
    
    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'size': self.size,
            'color': self.color,
        }
    
    def __repr__(self):
        return f'<OrderItem {self.id}>'



