from flask import Blueprint, jsonify
import psycopg2
import psycopg2.extras
import os

shipment_blueprint = Blueprint('shipments', __name__)

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

@shipment_blueprint.route('/incoming', methods=['GET'])
def get_incoming_shipments():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            # Enhanced query to include vendor name and part descriptions
            cur.execute("""
                SELECT 
                    s.shipment_id, 
                    s.order_id, 
                    s.expected_delivery_date, 
                    s.actual_delivery_date, 
                    s.status, 
                    s.notes,
                    po.vendor_id,
                    v.vendor_name, 
                    po.part_number, 
                    po.part_name
                FROM shipments s
                JOIN purchasing_orders po ON s.order_id = po.order_id
                JOIN vendors v ON po.vendor_id = v.vendor_id
                WHERE s.status IN ('In Transit', 'Delivered')
            """)
            shipments = cur.fetchall()
            return jsonify([dict(shipment) for shipment in shipments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Additional routes and functionalities can be added here
