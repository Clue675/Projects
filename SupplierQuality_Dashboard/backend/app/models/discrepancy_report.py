import psycopg2
import os

class DiscrepancyReport:
    def __init__(self, report_id, order_id, rejection_code_id, issue_details, inspector_name, inspection_date, severity, recommended_action, created_at):
        self.report_id = report_id
        self.order_id = order_id
        self.rejection_code_id = rejection_code_id
        self.issue_details = issue_details
        self.inspector_name = inspector_name
        self.inspection_date = inspection_date
        self.severity = severity
        self.recommended_action = recommended_action
        self.created_at = created_at

    @staticmethod
    def create_new_report(report_details):
        connection = psycopg2.connect(os.getenv('DATABASE_URL'))
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO discrepancy_reports 
                    (order_id, rejection_code_id, issue_details, inspector_name, inspection_date, severity, recommended_action, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                    RETURNING report_id
                """, (
                    report_details['order_id'],
                    report_details['rejection_code_id'],
                    report_details['issue_details'],
                    report_details['inspector_name'],
                    report_details['inspection_date'],
                    report_details.get('severity', 'Unknown'),
                    report_details.get('recommended_action', 'None')
                ))
                report_id = cursor.fetchone()[0]
                connection.commit()
                return report_id


    @staticmethod
    def get_all_reports():
        connection = psycopg2.connect(os.getenv('DATABASE_URL'))
        reports = []
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT dr.report_id, dr.order_id, dr.rejection_code_id, dr.issue_details, 
                           dr.inspector_name, dr.inspection_date, dr.severity, dr.recommended_action,
                           dr.created_at, v.vendor_name
                    FROM discrepancy_reports dr
                    JOIN purchasing_orders po ON dr.order_id = po.order_id
                    JOIN vendors v ON po.vendor_id = v.vendor_id
                """)
                reports = cursor.fetchall()
                columns = ['report_id', 'order_id', 'rejection_code_id', 'issue_details', 
                           'inspector_name', 'inspection_date', 'severity', 'recommended_action',
                           'created_at', 'vendor_name']
                return [dict(zip(columns, report)) for report in reports]

# class NonconformingNotification:
#     def __init__(self, notification_id, report_id, action, status, created_at, submitted_at=None):
#         self.notification_id = notification_id
#         self.report_id = report_id
#         self.action = action
#         self.status = status
#         self.created_at = created_at
#         self.submitted_at = submitted_at

#     @staticmethod
#     def create_notification(notification_details):
#         connection = psycopg2.connect(os.getenv('DATABASE_URL'))
#         with connection:
#             with connection.cursor() as cursor:
#                 cursor.execute("""
#                     INSERT INTO nonconforming_notifications 
#                     (report_id, action, status, created_at)
#                     VALUES (%s, %s, %s, NOW())
#                     RETURNING notification_id
#                 """, (
#                     notification_details['report_id'],
#                     notification_details['action'],
#                     'Pending'  # Initial status is always 'Pending'
#                 ))
#                 notification_id = cursor.fetchone()[0]
#                 connection.commit()
#                 return notification_id

#     @staticmethod
#     def submit_notification(notification_id):
#         connection = psycopg2.connect(os.getenv('DATABASE_URL'))
#         with connection:
#             with connection.cursor() as cursor:
#                 cursor.execute("""
#                     UPDATE nonconforming_notifications
#                     SET status = 'Submitted', submitted_at = NOW()
#                     WHERE notification_id = %s
#                 """, (notification_id,))
#                 connection.commit()

#     @staticmethod
#     def get_all_notifications():
#         connection = psycopg2.connect(os.getenv('DATABASE_URL'))
#         notifications = []
#         with connection:
#             with connection.cursor() as cursor:
#                 cursor.execute("""
#                     SELECT nn.notification_id, nn.report_id, nn.action, nn.status, 
#                            nn.created_at, nn.submitted_at
#                     FROM nonconforming_notifications nn
#                 """)
#                 notifications = cursor.fetchall()
#                 columns = ['notification_id', 'report_id', 'action', 'status', 
#                            'created_at', 'submitted_at']
#                 return [dict(zip(columns, notification)) for notification in notifications]

# # Additional methods and logic for the NonconformingNotification class can be added as needed
