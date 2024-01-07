import json
from flask import Blueprint, request, jsonify
import logging
import psycopg2
import psycopg2.extras
import os
from flask_cors import CORS, cross_origin  # Import CORS
from datetime import datetime




# Set up basic configuration for logging
logging.basicConfig(level=logging.INFO)


vendor_blueprint = Blueprint('vendor', __name__)
CORS(vendor_blueprint)


def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))


@vendor_blueprint.route('/api/vendor/create', methods=['POST'])
@cross_origin()
def create_vendor():
    data = request.json
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO vendors (vendor_name, contact_info, performance_score, status, last_audit_date, next_audit_date, comments)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING vendor_id;
            """, (
                data['vendor_name'],
                data['contact_info'],
                data['performance_score'],
                data['status'],
                data['last_audit_date'],
                data['next_audit_date'],
                data['comments']
            ))
            vendor_id = cursor.fetchone()[0]
            connection.commit()
            return jsonify({"message": "Vendor created successfully", "vendor_id": vendor_id}), 201
    except Exception as e:
        connection.rollback()
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@vendor_blueprint.route('/active', methods=['GET'])
@cross_origin()
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
@cross_origin()
def create_vendor_entry():
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

@vendor_blueprint.route('/certificates', methods=['GET'])
@cross_origin()
def fetch_all_vendor_certificates():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT * FROM vendor_certificates;")
            certificates = cur.fetchall()
            return jsonify([dict(certificate) for certificate in certificates])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
        
@vendor_blueprint.route('/vendor-certifications', methods=['GET'])
@cross_origin()
def get_vendor_certifications():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT v.vendor_name, vc.certificate_name, vc.issued_date, vc.expiration_date
                FROM vendor_certificates vc
                JOIN vendors v ON vc.vendor_id = v.vendor_id
            """)
            certifications = cur.fetchall()
            return jsonify([dict(cert) for cert in certifications])
    except Exception as e:
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

@vendor_blueprint.route('/vendor-data/<int:vendor_id>', methods=['GET'])
def get_vendor_data(vendor_id):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            # Fetch performance data
            cur.execute("SELECT * FROM vendor_performance WHERE vendor_id = %s;", (vendor_id,))
            performance_data = cur.fetchall()

            # Fetch nonconforming reports
            cur.execute("SELECT * FROM nonconforming_reports WHERE vendor_id = %s;", (vendor_id,))
            nonconforming_reports = cur.fetchall()

            # You can add more queries to fetch different types of data

            return jsonify({
                'performance_data': [dict(row) for row in performance_data],
                'nonconforming_reports': [dict(row) for row in nonconforming_reports]
                # Include other data as needed
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


def create_vendor_account(vendor_info):
    connection = create_server_connection()
    with connection:
        with connection.cursor() as cursor:
            # Add vendor information
            cursor.execute("""
                INSERT INTO vendors (vendor_name, contact_info, email, password)
                VALUES (%s, %s, %s, %s) RETURNING vendor_id;
            """, (
                vendor_info['vendor_name'],
                vendor_info['contact_info'],
                vendor_info['email'],
                generate_password_hash(vendor_info['password'])
            ))
            vendor_id = cursor.fetchone()[0]

            # Insert other vendor details as necessary

            connection.commit()
            return vendor_id

@vendor_blueprint.route('/vendor/<int:vendor_id>/certificates', methods=['POST'])
def upload_certificate(vendor_id):
    # Certificate type can be ISO9001, AS9100, NADCAP, Calibration, etc.
    certificate_type = request.form.get('certificateType')
    file_path = handle_file_upload(request.files.get('certificateFile'))

    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        with conn.cursor() as cursor:
            # Insert certificate details into the vendor_certificates table
            cursor.execute("""
                INSERT INTO vendor_certificates 
                (vendor_id, certificate_name, certificate_text, file_reference, issued_date, issued_by, expiration_date, notes, created_at) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW()) 
                RETURNING id;
            """, (
                vendor_id,
                certificate_type,
                request.form.get('certificateText'),
                file_path,
                request.form.get('issuedDate'),
                request.form.get('issuedBy'),
                request.form.get('expirationDate'),
                request.form.get('notes')
            ))
            certificate_id = cursor.fetchone()[0]

            # Update the certifications array in the vendors table
            cursor.execute("""
                UPDATE vendors
                SET certifications = coalesce(certifications, '[]'::jsonb) || %s::jsonb
                WHERE vendor_id = %s;
            """, (json([{certificate_type: certificate_id}]), vendor_id))

            conn.commit()
            return jsonify({'message': 'Certificate uploaded successfully', 'certificate_id': certificate_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()