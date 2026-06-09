"""Category routes."""
from flask import Blueprint, request, jsonify
from backend.app import db
from backend.models.category import Category
from backend.routes.auth import token_required, admin_required

categories_bp = Blueprint('categories', __name__)


@categories_bp.route('', methods=['GET'])
def get_categories():
    """Get all categories."""
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories]), 200


@categories_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get a single category."""
    category = Category.query.get_or_404(category_id)
    return jsonify(category.to_dict()), 200


@categories_bp.route('', methods=['POST'])
@admin_required
def create_category(current_user):
    """Create a new category."""
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('slug'):
        return jsonify({'error': 'Name and slug required'}), 400
    
    if Category.query.filter_by(slug=data['slug']).first():
        return jsonify({'error': 'Slug already exists'}), 400
    
    category = Category(
        name=data['name'],
        slug=data['slug'],
        description=data.get('description'),
        image=data.get('image')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201


@categories_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required
def update_category(current_user, category_id):
    """Update a category."""
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    
    if 'name' in data:
        category.name = data['name']
    if 'slug' in data:
        existing = Category.query.filter_by(slug=data['slug']).first()
        if existing and existing.id != category_id:
            return jsonify({'error': 'Slug already exists'}), 400
        category.slug = data['slug']
    if 'description' in data:
        category.description = data['description']
    if 'image' in data:
        category.image = data['image']
    
    db.session.commit()
    
    return jsonify(category.to_dict()), 200


@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(current_user, category_id):
    """Delete a category."""
    category = Category.query.get_or_404(category_id)
    
    # Check if category has products
    if category.products:
        return jsonify({'error': 'Cannot delete category with products'}), 400
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted'}), 200



