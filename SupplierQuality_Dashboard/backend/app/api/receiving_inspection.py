from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin
import psycopg2
from datetime import datetime
import os

receiving_inspection_blueprint = Blueprint('receiving_inspection', __name__)
CORS(receiving_inspection_blueprint)

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

def order_id_exists(order_id):
    conn = get_db_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1 FROM purchasing_orders WHERE order_id = %s", (order_id,))
            return cursor.fetchone() is not None

def update_supplier_performance(order_id, total_parts_received, total_parts_accepted):
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT vendor_id FROM purchasing_orders WHERE order_id = %s", (order_id,))
        vendor_id = cursor.fetchone()[0]

        quality_score = (total_parts_accepted / total_parts_received) * 100 if total_parts_received > 0 else 0
        record_date = datetime.now().date()

        cursor.execute("""
            INSERT INTO supplier_quality_records (vendor_id, quality_score, record_date)
            VALUES (%s, %s, %s)
            ON CONFLICT (vendor_id, record_date) 
            DO UPDATE SET quality_score = supplier_quality_records.quality_score + EXCLUDED.quality_score
        """, (vendor_id, quality_score, record_date))
        conn.commit()

def create_discrepancy_report(order_id, rejection_code_id, inspector_name, inspection_date):
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO discrepancy_reports 
            (order_id, rejection_code_id, inspector_name, inspection_date)
            VALUES (%s, %s, %s, %s)
        """, (order_id, rejection_code_id, inspector_name, inspection_date))
        conn.commit()

@receiving_inspection_blueprint.route('/inspection-records', methods=['POST'])
@cross_origin()
def create_record():
    data = request.get_json()
    required_fields = ['order_id', 'inspection_date', 'total_parts_received', 'total_parts_accepted', 'total_parts_rejected', 'rejection_code_id']

    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    if not order_id_exists(data['order_id']):
        return jsonify({'error': 'Order ID does not exist'}), 404

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO receiving_inspection_records 
                (order_id, inspection_date, total_parts_received, total_parts_accepted, total_parts_rejected, rejection_code_id)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                data['order_id'],
                data['inspection_date'],
                data['total_parts_received'],
                data['total_parts_accepted'],
                data['total_parts_rejected'],
                data['rejection_code_id']
            ))
            conn.commit()
            if data['total_parts_rejected'] > 0:
                create_discrepancy_report(data['order_id'], data['rejection_code_id'], data.get('inspector_name'), data['inspection_date'])

            update_supplier_performance(data['order_id'], data['total_parts_received'], data['total_parts_accepted'])
            return jsonify({'message': 'Inspection record created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()


@receiving_inspection_blueprint.route('/rejection-codes', methods=['GET'])
def get_rejection_codes():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM rejection_codes ORDER BY category, code")
            codes = cursor.fetchall()
            return jsonify(codes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
            
@receiving_inspection_blueprint.route('/shipment/<int:order_id>', methods=['GET'])
def get_shipment_data(order_id):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:  # Using RealDictCursor for easier JSON conversion
            cursor.execute("SELECT * FROM shipments WHERE order_id = %s", (order_id,))
            shipment_data = cursor.fetchone()

            if shipment_data:
                return jsonify(shipment_data), 200
            else:
                return jsonify({'error': 'Shipment with the specified order ID not found'}), 404
    except psycopg2.DatabaseError as db_err:
        # Log the database error here if logging is set up
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        # Log the generic error here if logging is set up
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()


# Additional routes and functionalities can be added here as needed

