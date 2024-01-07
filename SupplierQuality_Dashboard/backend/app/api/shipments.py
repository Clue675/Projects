from flask import Blueprint, request, jsonify
import logging
from flask_cors import cross_origin
from ..utils.db_connection import create_server_connection
import datetime

shipment_blueprint = Blueprint('shipments', __name__)

@shipment_blueprint.route('/incoming', methods=['POST'])
@cross_origin()
def add_incoming_shipment():
    logging.debug("Incoming request for /api/shipments/incoming")
    logging.debug("Request headers: %s", request.headers)

    data = request.get_json()
    required_fields = ['order_id', 'line_item', 'vendor_name', 'workorder_number',
                       'rework_number', 'part_number', 'qty_received', 'unit_cost', 'date_received', 'comments']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    try:
        conn = create_server_connection()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO shipments (order_id, line_item, vendor_name, workorder_number, rework_number, part_number, qty_received, unit_cost, date_received, comments)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['order_id'],
                data['line_item'],
                data['vendor_name'],
                data['workorder_number'],
                data.get('rework_number', None),
                data['part_number'],
                data['qty_received'],
                data['unit_cost'],
                datetime.datetime.strptime(data['date_received'], '%Y-%m-%d').date(),
                data['comments']
            ))
            conn.commit()
    except Exception as e:
        logging.error("Error: %s", str(e))
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

    response = jsonify({'message': 'Incoming shipment added successfully'})
    logging.debug("Response headers: %s", response.headers)
    return response, 201

# Other routes for the shipment blueprint
