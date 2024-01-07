from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_cors import CORS, cross_origin
import psycopg2
from app.utils.db_connection import create_server_connection
from app.models.purchasing import PurchasingOrder

purchasing_blueprint = Blueprint('purchasing', __name__)
CORS(purchasing_blueprint)

@purchasing_blueprint.route('/orders', methods=['POST'])
@cross_origin()
def create_order():
    data = request.get_json()
    required_fields = ['vendor_id', 'part_number', 'part_name', 'revision', 'material', 'workorder_number', 'quantity', 'status', 'promised_date']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    vendor_id = data['vendor_id']
    part_number = data['part_number']
    part_name = data['part_name']
    revision = data['revision']
    material = data['material']
    workorder_number = data['workorder_number']
    quantity = data['quantity']
    status = data['status']
    promised_date = datetime.strptime(data['promised_date'], '%Y-%m-%d')
    delivered_date = data.get('delivered_date')
    if delivered_date:
        delivered_date = datetime.strptime(delivered_date, '%Y-%m-%d')

    conn = create_server_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO purchasing_orders (vendor_id, part_number, part_name, revision, material, workorder_number, quantity, status, promised_date, delivered_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (vendor_id, part_number, part_name, revision, material, workorder_number, quantity, status, promised_date, delivered_date))
            conn.commit()
            return jsonify({'message': 'Order created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Additional routes and functionalities...

@purchasing_blueprint.route('/order/<int:order_id>', methods=['GET'])
@cross_origin()
def get_order_details(order_id):
    conn = create_server_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT po.*, v.vendor_name
                FROM purchasing_orders po
                JOIN vendors v ON po.vendor_id = v.vendor_id
                WHERE po.order_id = %s
            """, (order_id,))
            order_details = cur.fetchone()
            if order_details:
                return jsonify(dict(order_details))
            else:
                return jsonify({'error': 'Order not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


# Additional routes and functionalities...
