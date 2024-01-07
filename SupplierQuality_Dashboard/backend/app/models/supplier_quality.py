from datetime import datetime
import os
import psycopg2
from app.utils.performance_utils import categorize_performance


def create_server_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

def add_supplier_quality_record(data):
    connection = create_server_connection()
    try:
        with connection.cursor() as cursor:
            overall_score = (data['quality_score'] + data.get('delivery_score', 100)) / 2
            quality_category, quality_color = categorize_performance(data['quality_score'])
            delivery_category, delivery_color = categorize_performance(data.get('delivery_score', 100))
            overall_category, overall_color = categorize_performance(overall_score)

            cursor.execute("""
                INSERT INTO supplier_quality_records 
                (vendor_id, quality_score, delivery_score, overall_score, 
                 quality_category, delivery_category, overall_category, 
                 quality_color, delivery_color, overall_color, 
                 record_date, notes, recorded_by, created_at, otd_status, 
                 actual_delivery_date, po_due_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                data['vendor_id'],
                data['quality_score'],
                data.get('delivery_score', 100),
                overall_score,
                quality_category,
                delivery_category,
                overall_category,
                quality_color,
                delivery_color,
                overall_color,
                data['record_date'],
                data.get('notes', ''),
                data.get('recorded_by', ''),
                datetime.now(),
                data.get('otd_status', ''),
                data.get('actual_delivery_date', None),
                data.get('po_due_date', None)
            ))
            record_id = cursor.fetchone()[0]
            connection.commit()
            return record_id
    finally:
        connection.close()


def get_supplier_quality_records(vendor_id, filter_type, filter_value, page, per_page):
    connection = create_server_connection()
    try:
        with connection.cursor() as cursor:
            base_query = "SELECT * FROM supplier_quality_records"
            params = []

            if vendor_id is not None:
                base_query += " WHERE vendor_id = %s"
                params.append(vendor_id)

            if filter_type == 'month':
                base_query += " AND EXTRACT(MONTH FROM record_date) = EXTRACT(MONTH FROM DATE %s)"
                params.append(filter_value)
            elif filter_type == 'quarter':
                base_query += " AND EXTRACT(QUARTER FROM record_date) = EXTRACT(QUARTER FROM DATE %s)"
                params.append(filter_value)
            elif filter_type == 'year':
                base_query += " AND EXTRACT(YEAR FROM record_date) = EXTRACT(YEAR FROM DATE %s)"
                params.append(filter_value)

            offset = (page - 1) * per_page
            pagination_query = " LIMIT %s OFFSET %s"
            params.extend([per_page, offset])

            cursor.execute(base_query + pagination_query, tuple(params))
            records = cursor.fetchall()

            total_query = "SELECT COUNT(*) FROM supplier_quality_records"
            if vendor_id is not None:
                total_query += " WHERE vendor_id = %s"
                cursor.execute(total_query, (vendor_id,))
            else:
                cursor.execute(total_query)
            total_records = cursor.fetchone()[0]

            return records, total_records
    finally:
        connection.close()
