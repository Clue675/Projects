from flask import Blueprint, request, jsonify
import psycopg2
from datetime import datetime
import os

# Blueprint for receiving inspection functionalities
receiving_inspection_blueprint = Blueprint('receiving_inspection', __name__)

def get_db_connection():
    # Connect to the database using environment variable
    return psycopg2.connect(os.getenv('DATABASE_URL'))

def update_supplier_performance(order_id, total_parts_received, total_parts_accepted):
    """
    Update supplier performance based on inspection results.
    """
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT vendor_id FROM purchasing_orders WHERE order_id = %s", (order_id,))
        vendor_id = cursor.fetchone()[0]

        quality_score = (total_parts_accepted / total_parts_received) * 100
        record_date = datetime.now().date()

        cursor.execute("""
            INSERT INTO supplier_quality_records (vendor_id, quality_score, record_date)
            VALUES (%s, %s, %s)
            ON CONFLICT (vendor_id, record_date) 
            DO UPDATE SET quality_score = supplier_quality_records.quality_score + EXCLUDED.quality_score
        """, (vendor_id, quality_score, record_date))
        conn.commit()

def create_discrepancy_report(order_id, rejection_details, inspector_name, inspection_date):
    """
    Create a discrepancy report if there are rejected parts.
    """
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO discrepancy_reports 
            (order_id, issue_details, inspector_name, inspection_date)
            VALUES (%s, %s, %s, %s)
        """, (order_id, rejection_details, inspector_name, inspection_date))
        conn.commit()

@receiving_inspection_blueprint.route('/records', methods=['POST'])
def create_record():
    """
    Create a new receiving inspection record.
    """
    data = request.get_json()
    required_fields = ['order_id', 'inspection_date', 'total_parts_received', 'total_parts_accepted', 'total_parts_rejected']
    
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    try:
        order_id = int(data['order_id'])
        inspection_date = datetime.strptime(data['inspection_date'], '%Y-%m-%d')
        total_parts_received = int(data['total_parts_received'])
        total_parts_accepted = int(data['total_parts_accepted'])
        total_parts_rejected = int(data['total_parts_rejected'])
        rejection_details = data.get('rejection_details', [])
        inspector_name = data.get('inspector_name', 'Unknown Inspector')
        comments = data.get('comments', '')

        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM purchasing_orders WHERE order_id = %s", (order_id,))
            if not cur.fetchone():
                return jsonify({'error': 'Order ID does not exist'}), 404

            cur.execute("""
                INSERT INTO receiving_inspection_records 
                (order_id, inspection_date, inspector_name, total_parts_received, total_parts_accepted, total_parts_rejected, rejection_details, comments)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (order_id, inspection_date, inspector_name, total_parts_received, total_parts_accepted, total_parts_rejected, rejection_details, comments))
            conn.commit()

            update_supplier_performance(order_id, total_parts_received, total_parts_accepted)

            if total_parts_rejected > 0:
                create_discrepancy_report(order_id, rejection_details, inspector_name, inspection_date)

            return jsonify({'message': 'Inspection record created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Additional routes and functionalities can be added here as needed
