from flask import Blueprint, request, jsonify
import psycopg2
import psycopg2.extras
import os
from datetime import datetime

supplier_quality_blueprint = Blueprint('supplier_quality', __name__)

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

@supplier_quality_blueprint.route('/records', methods=['POST'])
def create_quality_record():
    data = request.get_json()

    # Input Validation Logic
    if 'vendor_id' not in data or not isinstance(data['vendor_id'], int):
        return jsonify({'error': 'Vendor ID is required and must be an integer.'}), 400
    if 'quality_score' not in data or not isinstance(data['quality_score'], (int, float)) or not 0 <= data['quality_score'] <= 100:
        return jsonify({'error': 'Quality score must be a percentage between 0 and 100.'}), 400
    if 'record_date' in data:  # Optional: Validate record_date if provided
        try:
            record_date = datetime.strptime(data['record_date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid record date. Use YYYY-MM-DD format.'}), 400
    else:
        record_date = datetime.utcnow()

    # Additional validations as needed...

    try:
        # Establish database connection
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Insert supplier quality record
            cur.execute("""
                INSERT INTO supplier_quality_records (vendor_id, quality_score, record_date, notes)
                VALUES (%s, %s, %s, %s) RETURNING id;
            """, (data['vendor_id'], data['quality_score'], record_date, data.get('notes', '')))
            record_id = cur.fetchone()[0]
            conn.commit()

        return jsonify({'message': 'Quality record created successfully!', 'id': record_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Add other routes and functionalities as needed
