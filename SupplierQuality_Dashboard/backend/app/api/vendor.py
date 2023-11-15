from flask import Blueprint, request, jsonify
import psycopg2
import psycopg2.extras
import os
from datetime import datetime

vendor_blueprint = Blueprint('vendor', __name__)

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

@vendor_blueprint.route('/active', methods=['GET'])
def get_active_vendors():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT v.*, array_agg(vc.certificate_name) AS certificates
                FROM vendors v
                LEFT JOIN vendor_certificates vc ON v.vendor_id = vc.vendor_id
                WHERE v.status = 'Active'
                GROUP BY v.vendor_id
            """)
            active_vendors = cur.fetchall()
            return jsonify([dict(vendor) for vendor in active_vendors])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@vendor_blueprint.route('/vendors', methods=['POST'])
def create_vendor():
    data = request.get_json()

    if 'vendor_name' not in data or not isinstance(data['vendor_name'], str):
        return jsonify({'error': 'Invalid or missing vendor name'}), 400

    # Additional validation checks for other fields can be added here

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Insert vendor
            cur.execute("""
                INSERT INTO vendors (vendor_name, contact_info, performance_score, status, last_audit_date, next_audit_date, comments, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING vendor_id
            """, (
                data.get('vendor_name'),
                data.get('contact_info', ''),
                data.get('performance_score'),
                data.get('status', 'Active'),
                data.get('last_audit_date'),
                data.get('next_audit_date'),
                data.get('comments', ''),
                datetime.utcnow()
            ))
            vendor_id = cur.fetchone()[0]

            # Insert certificates if provided
            certificates_data = data.get('certificates', [])
            for cert_data in certificates_data:
                cur.execute("""
                    INSERT INTO vendor_certificates (vendor_id, certificate_name, certificate_text, issued_date, issued_by, expiration_date, notes, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    vendor_id,
                    cert_data.get('certificate_name'),
                    cert_data.get('certificate_text'),
                    cert_data.get('issued_date'),
                    cert_data.get('issued_by'),
                    cert_data.get('expiration_date'),
                    cert_data.get('notes', ''),
                    datetime.utcnow(),
                    datetime.utcnow()
                ))

            conn.commit()
            return jsonify({'message': 'New vendor and certificates created', 'vendor_id': vendor_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@vendor_blueprint.route('/incoming-shipments', methods=['GET'])
def get_incoming_shipments():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT s.*, v.vendor_name, p.part_number, p.part_name
                FROM shipments s
                JOIN purchasing_orders p ON s.order_id = p.order_id
                JOIN vendors v ON p.vendor_id = v.vendor_id
                WHERE s.status IN ('In Transit', 'Delivered')
            """)
            shipments = cur.fetchall()
            return jsonify([dict(shipment) for shipment in shipments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
