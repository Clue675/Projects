# ReceivingInspectionRecord.py
import psycopg2
from datetime import datetime
import os

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

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
    def update_supplier_quality(record_details):
        with psycopg2.connect(os.getenv('DATABASE_URL')) as conn:
            with conn.cursor() as cursor:
                quality_score = (record_details['total_parts_accepted'] / record_details['total_parts_received']) * 100
                record_date = datetime.now().date()

                cursor.execute("""
                    INSERT INTO supplier_quality_records 
                    (vendor_id, quality_score, record_date)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (vendor_id, record_date) 
                    DO UPDATE SET quality_score = supplier_quality_records.quality_score + EXCLUDED.quality_score
                """, (record_details['vendor_id'], quality_score, record_date))
                conn.commit()

    @staticmethod
    def create_new_record(record_details):
        connection = get_db_connection()
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

        # Update supplier quality and create discrepancy report if necessary
        ReceivingInspectionRecord.update_supplier_quality(record_details)
        if record_details['total_parts_rejected'] > 0:
            DiscrepancyReport.create_from_inspection_record(record_details)
