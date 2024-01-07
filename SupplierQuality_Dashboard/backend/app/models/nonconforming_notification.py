# app/models/nonconforming_notification.py

import psycopg2
from app.utils.db_connection import create_server_connection

class NonconformingNotification:
    @staticmethod
    def create_notification(report_id, action):
        conn = create_server_connection()
        with conn.cursor() as cursor:
            # Fetch details from the discrepancy report
            cursor.execute("""
                SELECT part_number, order_id, rejection_code, issue_details
                FROM discrepancy_reports
                WHERE report_id = %s
            """, (report_id,))
            report_details = cursor.fetchone()

            if not report_details:
                raise ValueError("Discrepancy report not found")

            # Insert into nonconforming notifications
            cursor.execute("""
                INSERT INTO nonconforming_notifications
                (report_id, action, status, created_at, part_number, order_id, rejection_code, issue_details)
                VALUES (%s, %s, 'Pending', NOW(), %s, %s, %s, %s)
                RETURNING notification_id
            """, (report_id, action, report_details['part_number'], report_details['order_id'], report_details['rejection_code'], report_details['issue_details']))
            notification_id = cursor.fetchone()[0]
            conn.commit()
        conn.close()
        return notification_id

    @staticmethod
    def submit_notification(notification_id):
        conn = create_server_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE nonconforming_notifications
                SET status = 'Submitted', submitted_at = NOW()
                WHERE notification_id = %s
            """, (notification_id,))
            conn.commit()
        conn.close()

    @staticmethod
    def get_all_notifications():
        conn = create_server_connection()
        notifications = []
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM nonconforming_notifications
            """)
            notifications = cursor.fetchall()
        conn.close()
        return notifications
