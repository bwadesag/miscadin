"""Product model."""
from datetime import datetime
from backend.app import db
import json


class Product(db.Model):
    """Product model."""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)
    images = db.Column(db.Text, nullable=False)  # JSON array stored as text
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    stock = db.Column(db.Integer, default=0, nullable=False)
    sizes = db.Column(db.Text, nullable=False)  # JSON array stored as text
    colors = db.Column(db.Text, nullable=False)  # JSON array stored as text
    featured = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def get_images(self) -> list:
        """Get images as list."""
        return json.loads(self.images) if self.images else []
    
    def set_images(self, images: list):
        """Set images from list."""
        self.images = json.dumps(images)
    
    def get_sizes(self) -> list:
        """Get sizes as list."""
        return json.loads(self.sizes) if self.sizes else []
    
    def set_sizes(self, sizes: list):
        """Set sizes from list."""
        self.sizes = json.dumps(sizes)
    
    def get_colors(self) -> list:
        """Get colors as list."""
        return json.loads(self.colors) if self.colors else []
    
    def set_colors(self, colors: list):
        """Set colors from list."""
        self.colors = json.dumps(colors)
    
    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'originalPrice': float(self.original_price) if self.original_price else None,
            'images': self.get_images(),
            'categoryId': str(self.category_id),
            'category': self.category.to_dict() if self.category else None,
            'stock': self.stock,
            'sizes': self.get_sizes(),
            'colors': self.get_colors(),
            'featured': self.featured,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
        }
    
    def __repr__(self):
        return f'<Product {self.name}>'



