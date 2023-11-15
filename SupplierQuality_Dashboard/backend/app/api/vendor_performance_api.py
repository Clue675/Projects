from flask import Blueprint, request, jsonify
from models.vendor_performance import VendorPerformance
import psycopg2
import os

vendor_performance_blueprint = Blueprint('vendor_performance', __name__)

@vendor_performance_blueprint.route('/performance', methods=['POST'])
def update_performance():
    data = request.get_json()
    vendor_id = data['vendor_id']
    quality_score = data['quality_score']
    delivery_score = data['delivery_score']
    record_date = data['record_date']
    notes = data.get('notes', '')

    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        VendorPerformance.insert_vendor_performance(conn, vendor_id, quality_score, delivery_score, record_date, notes)
        return jsonify({'message': 'Vendor performance updated successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

# Register this blueprint in your main app
