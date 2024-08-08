from flask import Blueprint, jsonify, request

from app import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.services.auth.auth import token_required

orders = Blueprint('orders', __name__)


@orders.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    items = data.get('items')

    new_order = Order(user_id=current_user.id)
    db.session.add(new_order)

    for item in items:
        product = Product.query.get(item['product_id'])
        if product and product.stock >= item['quantity']:
            order_item = OrderItem(
                order=new_order,
                product_id=item['product_id'],
                quantity=item['quantity'],
                price=product.price
            )
            db.session.add(order_item)
            product.stock -= item['quantity']
        else:
            db.session.rollback()
            return jsonify({'message': 'Product not available in requested quantity'}), 400

    db.session.commit()
    return jsonify({'message': 'Order created successfully', 'order_id': new_order.id}), 201


@orders.route('/api/orders', methods=['GET'])
@token_required
def get_user_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).all()
    orders_data = []
    for order in orders:
        items = [{'product_id': item.product_id, 'quantity': item.quantity, 'price': item.price} for item in
                 order.items]
        orders_data.append({
            'id': order.id,
            'status': order.status,
            'created_at': order.created_at,
            'items': items
        })
    return jsonify(orders_data)


@orders.route('/api/orders/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    order = Order.query.filter_by(id=order_id, user_id=current_user.id).first()
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    items = [{'product_id': item.product_id, 'quantity': item.quantity, 'price': item.price} for item in order.items]
    order_data = {
        'id': order.id,
        'status': order.status,
        'created_at': order.created_at,
        'items': items
    }
    return jsonify(order_data)
