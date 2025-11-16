"""Product routes."""
from flask import Blueprint, request, jsonify
from backend.app import db
from backend.models.product import Product
from backend.models.category import Category
from backend.routes.auth import token_required, admin_required

products_bp = Blueprint('products', __name__)


@products_bp.route('', methods=['GET'])
def get_products():
    """Get all products."""
    category_id = request.args.get('categoryId')
    featured = request.args.get('featured')
    
    query = Product.query
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if featured and featured.lower() == 'true':
        query = query.filter_by(featured=True)
    
    products = query.all()
    return jsonify([product.to_dict() for product in products]), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product."""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200


@products_bp.route('', methods=['POST'])
@admin_required
def create_product(current_user):
    """Create a new product."""
    data = request.get_json()
    
    required_fields = ['name', 'description', 'price', 'categoryId', 'stock', 'sizes', 'colors']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verify category exists
    category = Category.query.get(data['categoryId'])
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        original_price=data.get('originalPrice'),
        category_id=data['categoryId'],
        stock=data['stock'],
        featured=data.get('featured', False)
    )
    product.set_images(data.get('images', []))
    product.set_sizes(data['sizes'])
    product.set_colors(data['colors'])
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201


@products_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    """Update a product."""
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'originalPrice' in data:
        product.original_price = data['originalPrice']
    if 'categoryId' in data:
        category = Category.query.get(data['categoryId'])
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        product.category_id = data['categoryId']
    if 'stock' in data:
        product.stock = data['stock']
    if 'images' in data:
        product.set_images(data['images'])
    if 'sizes' in data:
        product.set_sizes(data['sizes'])
    if 'colors' in data:
        product.set_colors(data['colors'])
    if 'featured' in data:
        product.featured = data['featured']
    
    db.session.commit()
    
    return jsonify(product.to_dict()), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    """Delete a product."""
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted'}), 200



