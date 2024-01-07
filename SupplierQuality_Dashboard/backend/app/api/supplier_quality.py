import logging
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.utils.db_connection import create_server_connection

supplier_quality_blueprint = Blueprint('supplier_quality', __name__)
CORS(supplier_quality_blueprint)


# Set up basic configuration for logging
logging.basicConfig(level=logging.INFO)
                    
                    
@supplier_quality_blueprint.route('/records', methods=['GET'])
def add_supplier_quality_record(data):
    connection = create_server_connection()
    # Retrieve query parameters for filtering and pagination
    filter_type = request.args.get('filter_type', 'all')
    filter_value = request.args.get('filter_value')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))

    try:
        # Assuming get_supplier_quality_records can handle a None value for vendor_id
        records, total_records = get_supplier_quality_records(None, filter_type, filter_value, page, per_page)
        return jsonify({'records': records, 'total_records': total_records, 'page': page, 'per_page': per_page}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
