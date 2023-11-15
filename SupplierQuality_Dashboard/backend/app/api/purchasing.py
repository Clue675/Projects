from flask import Blueprint, request, jsonify
import psycopg2
import psycopg2.extras
import os
from datetime import datetime

purchasing_blueprint = Blueprint('purchasing', __name__)

# Function to establish a database connection
def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

@purchasing_blueprint.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    # Validate required fields
    required_fields = ['vendor_id', 'part_number', 'part_name', 'quantity', 'promised_date']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    vendor_id = data['vendor_id']
    part_number = data['part_number']
    part_name = data['part_name']
    quantity = data['quantity']
    promised_date = datetime.strptime(data['promised_date'], '%Y-%m-%d')

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO purchasing_orders (vendor_id, part_number, part_name, quantity, promised_date)
                VALUES (%s, %s, %s, %s, %s)
            """, (vendor_id, part_number, part_name, quantity, promised_date))
            conn.commit()
            return jsonify({'message': 'Order created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@purchasing_blueprint.route('/orders', methods=['GET'])
def get_orders():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT * FROM purchasing_orders")
            orders = cur.fetchall()
            return jsonify([dict(order) for order in orders])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@purchasing_blueprint.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.get_json()
    status = data.get('status')
    delivered_date = None if 'delivered_date' not in data else datetime.strptime(data['delivered_date'], '%Y-%m-%d')

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE purchasing_orders
                SET status = %s, delivered_date = %s
                WHERE order_id = %s
            """, (status, delivered_date, order_id))
            if cur.rowcount == 0:
                return jsonify({'error': 'Order not found'}), 404
            conn.commit()
            return jsonify({'message': 'Order updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
