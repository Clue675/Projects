import psycopg2
from database import create_server_connection
from datetime import datetime

def categorize_performance(score):
    if score >= 98.0:
        return 'Excellent', 'Green'
    elif 95.0 <= score < 98.0:
        return 'Satisfactory', 'Yellow'
    else:
        return 'Unacceptable', 'Red'

def add_supplier_quality_record(record_data):
    """Add a new supplier quality record to the database."""
    connection = create_server_connection()
    with connection:
        with connection.cursor() as cursor:
            # Calculate overall score and categorize performance
            overall_score = (record_data['quality_score'] + record_data.get('delivery_score', 100)) / 2
            quality_category, quality_color = categorize_performance(record_data['quality_score'])
            delivery_category, delivery_color = categorize_performance(record_data.get('delivery_score', 100))
            overall_category, overall_color = categorize_performance(overall_score)

            # Insert data into the supplier_quality_records table
            cursor.execute("""
                INSERT INTO supplier_quality_records 
                (vendor_id, quality_score, delivery_score, overall_score, 
                 quality_category, delivery_category, overall_category, 
                 quality_color, delivery_color, overall_color, 
                 record_date, notes, recorded_by, created_at, otd_status, actual_delivery_date, po_due_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                record_data['vendor_id'],
                record_data['quality_score'],
                record_data.get('delivery_score', 100),  # Default to 100 if not provided
                overall_score,
                quality_category,
                delivery_category,
                overall_category,
                quality_color,
                delivery_color,
                overall_color,
                record_data['record_date'],
                record_data['notes'],
                record_data['recorded_by'],
                record_data['created_at'],
                record_data['otd_status'],
                record_data['actual_delivery_date'],
                record_data['po_due_date']
            ))
            new_id = cursor.fetchone()[0]
            connection.commit()
            return new_id

def get_supplier_quality_records(vendor_id):
    """Retrieve all quality records for a specific vendor."""
    connection = create_server_connection()
    records = []
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM supplier_quality_records WHERE vendor_id = %s;", (vendor_id,))
            records = cursor.fetchall()
    return records

# Additional functions can be defined here for updating, deleting, or querying specific records
