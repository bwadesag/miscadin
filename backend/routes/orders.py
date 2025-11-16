"""Order routes."""
from flask import Blueprint, request, jsonify
from backend.app import db
from backend.models.order import Order, OrderItem
from backend.models.product import Product
from backend.routes.auth import token_required, admin_required

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('', methods=['GET'])
@token_required
def get_orders(current_user):
    """Get orders for current user or all orders if admin."""
    if current_user.role == 'admin':
        orders = Order.query.all()
    else:
        orders = Order.query.filter_by(user_id=current_user.id).all()
    
    return jsonify([order.to_dict() for order in orders]), 200


@orders_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    """Get a single order."""
    order = Order.query.get_or_404(order_id)
    
    # Check if user owns the order or is admin
    if order.user_id != current_user.id and current_user.role != 'admin':
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify(order.to_dict()), 200


@orders_bp.route('', methods=['POST'])
@token_required
def create_order(current_user):
    """Create a new order."""
    data = request.get_json()
    
    if not data or not data.get('items') or not data.get('shippingAddress'):
        return jsonify({'error': 'Items and shipping address required'}), 400
    
    # Calculate total and create order items
    total = 0
    order_items = []
    
    for item_data in data['items']:
        product = Product.query.get(item_data['product']['id'])
        if not product:
            return jsonify({'error': f"Product {item_data['product']['id']} not found"}), 404
        
        if product.stock < item_data['quantity']:
            return jsonify({'error': f"Insufficient stock for {product.name}"}), 400
        
        item_total = float(product.price) * item_data['quantity']
        total += item_total
        
        order_item = OrderItem(
            product_id=product.id,
            quantity=item_data['quantity'],
            size=item_data['size'],
            color=item_data['color'],
            price=product.price
        )
        order_items.append(order_item)
        
        # Update stock
        product.stock -= item_data['quantity']
    
    # Create order
    order = Order(
        user_id=current_user.id,
        total=total,
        status='pending'
    )
    order.set_shipping_address(data['shippingAddress'])
    order.items = order_items
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify(order.to_dict()), 201


@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(current_user, order_id):
    """Update order status (admin only)."""
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    
    if not data or not data.get('status'):
        return jsonify({'error': 'Status required'}), 400
    
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    order.status = data['status']
    db.session.commit()
    
    return jsonify(order.to_dict()), 200



