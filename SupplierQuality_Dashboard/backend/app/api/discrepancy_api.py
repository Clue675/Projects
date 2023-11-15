from flask import Blueprint, request, jsonify
import psycopg2
import os
from app.models.discrepancy_report import DiscrepancyReport


discrepancy_blueprint = Blueprint('discrepancy', __name__)

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

@discrepancy_blueprint.route('/reports', methods=['POST'])
def create_report():
    data = request.get_json()
    required_fields = ['order_id', 'issue_details', 'severity', 'affected_parts', 'recommended_action']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    try:
        conn = get_db_connection()
        report_id = DiscrepancyReport.create_new_report_from_inspection_record(data, conn)
        
        if report_id is None:
            return jsonify({'error': 'Order ID not found or insufficient data for report creation'}), 404

        return jsonify({'message': 'Discrepancy report created successfully!', 'report_id': report_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@discrepancy_blueprint.route('/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """
    Retrieve a specific discrepancy report by its ID.
    """
    try:
        conn = get_db_connection()
        report = DiscrepancyReport.get_report_by_id(report_id, conn)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404

        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@discrepancy_blueprint.route('/reports/<report_id>', methods=['PUT'])
def update_report(report_id):
    """
    Update an existing discrepancy report.
    """
    data = request.get_json()
    try:
        conn = get_db_connection()
        success = DiscrepancyReport.update_report(report_id, data, conn)
        
        if not success:
            return jsonify({'error': 'Report not found or update failed'}), 404

        return jsonify({'message': 'Discrepancy report updated successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@discrepancy_blueprint.route('/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    """
    Delete a discrepancy report.
    """
    try:
        conn = get_db_connection()
        success = DiscrepancyReport.delete_report(report_id, conn)
        
        if not success:
            return jsonify({'error': 'Report not found or deletion failed'}), 404

        return jsonify({'message': 'Discrepancy report deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

# Additional routes and functionalities can be added here as needed
