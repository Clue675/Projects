import psycopg2
from datetime import datetime
import os

class ReceivingInspectionRecord:
    def __init__(self, record_id, order_id, inspection_date, inspector_name, total_parts_received, total_parts_accepted, total_parts_rejected, rejection_details, notes):
        self.record_id = record_id
        self.order_id = order_id
        self.inspection_date = inspection_date
        self.inspector_name = inspector_name
        self.total_parts_received = total_parts_received
        self.total_parts_accepted = total_parts_accepted
        self.total_parts_rejected = total_parts_rejected
        self.rejection_details = rejection_details
        self.notes = notes

    @staticmethod
    def update_supplier_quality(order_id, total_parts_received, total_parts_accepted):
        with psycopg2.connect(os.getenv('DATABASE_URL')) as conn:
            with conn.cursor() as cursor:
                # Example calculation (adjust as needed)
                quality_score = (total_parts_accepted / total_parts_received) * 100
                record_date = datetime.now().date()

                # Check if a record already exists for the vendor on the current date
                cursor.execute("""
                    SELECT COUNT(*) FROM supplier_quality_records 
                    WHERE vendor_id = %s AND record_date = %s
                """, (order_id, record_date))
                count = cursor.fetchone()[0]

                if count > 0:
                    # Update existing record
                    cursor.execute("""
                        UPDATE supplier_quality_records 
                        SET quality_score = %s
                        WHERE vendor_id = %s AND record_date = %s
                    """, (quality_score, order_id, record_date))
                else:
                    # Insert new record
                    cursor.execute("""
                        INSERT INTO supplier_quality_records 
                        (vendor_id, quality_score, record_date)
                        VALUES (%s, %s, %s)
                    """, (order_id, quality_score, record_date))
                conn.commit()

    @staticmethod
    def create_new_record(record_details):
        connection = psycopg2.connect(os.getenv('DATABASE_URL'))
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO receiving_inspection_records 
                    (order_id, inspection_date, inspector_name, total_parts_received, total_parts_accepted, total_parts_rejected, rejection_details, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    record_details['order_id'],
                    record_details['inspection_date'],
                    record_details['inspector_name'],
                    record_details['total_parts_received'],
                    record_details['total_parts_accepted'],
                    record_details['total_parts_rejected'],
                    record_details['rejection_details'],
                    record_details['notes']
                ))
            connection.commit()

        ReceivingInspectionRecord.update_supplier_quality(
            record_details['order_id'], 
            record_details['total_parts_received'], 
            record_details['total_parts_accepted']
        )
