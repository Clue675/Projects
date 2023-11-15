class DiscrepancyReport:
    def __init__(self, report_id, order_id, vendor_name, part_number, part_name, issue_details, inspector_name, inspection_date, severity, affected_parts, recommended_action, quantity_received, quantity_rejected):
        self.report_id = report_id
        self.order_id = order_id
        self.vendor_name = vendor_name
        self.part_number = part_number
        self.part_name = part_name
        self.issue_details = issue_details
        self.inspector_name = inspector_name
        self.inspection_date = inspection_date
        self.severity = severity
        self.affected_parts = affected_parts
        self.recommended_action = recommended_action
        self.quantity_received = quantity_received
        self.quantity_rejected = quantity_rejected

    @staticmethod
    def create_new_report_from_inspection_record(inspection_record_details, connection):
        with connection.cursor() as cursor:
            # Retrieve vendor name, part number, part name, and quantities based on order_id
            cursor.execute("""
                SELECT v.vendor_name, po.part_number, po.part_name, 
                       ri.total_parts_received, ri.total_parts_rejected
                FROM purchasing_orders po
                JOIN vendors v ON po.vendor_id = v.vendor_id
                JOIN receiving_inspection_records ri ON po.order_id = ri.order_id
                WHERE po.order_id = %s
            """, (inspection_record_details['order_id'],))
            order_info = cursor.fetchone()
            if not order_info:
                return None  # Or handle error as appropriate

            vendor_name, part_number, part_name, quantity_received, quantity_rejected = order_info

            # Insert into discrepancy_reports
            cursor.execute("""
                INSERT INTO discrepancy_reports 
                (order_id, vendor_name, part_number, part_name, issue_details, inspector_name, inspection_date, severity, affected_parts, recommended_action, quantity_received, quantity_rejected)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                inspection_record_details['order_id'],
                vendor_name,
                part_number,
                part_name,
                inspection_record_details['rejection_details'],
                inspection_record_details['inspector_name'],
                inspection_record_details['inspection_date'],
                inspection_record_details.get('severity', 'Unknown'),
                inspection_record_details.get('affected_parts', 0),
                inspection_record_details.get('recommended_action', 'None'),
                quantity_received,
                quantity_rejected
            ))
            connection.commit()

    # ... Other methods like get_report, get_all_reports, etc.
