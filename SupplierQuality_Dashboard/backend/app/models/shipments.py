from ..utils.db_connection import create_server_connection

class Shipments:
    # Constructor with the new 'line_item' and other attributes
    def __init__(self, shipment_id, line_item, order_id, vendor_name, workorder_number, rework_number, part_number, qty_received, unit_cost, date_received, comments):
        self.shipment_id = shipment_id
        self.line_item = line_item
        self.order_id = order_id
        self.vendor_name = vendor_name
        self.workorder_number = workorder_number
        self.rework_number = rework_number
        self.part_number = part_number
        self.qty_received = qty_received
        self.unit_cost = unit_cost
        self.date_received = date_received
        self.comments = comments

    # Create a new shipment record in the database
    @staticmethod
    def create_new_shipment(shipment_details):
        connection = create_server_connection()
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO shipments 
                    (line_item, order_id, vendor_name, workorder_number, rework_number, part_number, qty_received, unit_cost, date_received, comments)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    shipment_details['line_item'],
                    shipment_details['order_id'],
                    shipment_details['vendor_name'],
                    shipment_details['workorder_number'],
                    shipment_details['rework_number'],
                    shipment_details['part_number'],
                    shipment_details['qty_received'],
                    shipment_details['unit_cost'],
                    shipment_details['date_received'],
                    shipment_details['comments']
                ))
                connection.commit()

    # Retrieve all shipments from the database
    @staticmethod
    def get_all_shipments():
        connection = create_server_connection()
        shipments = []
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM shipments")
                shipments = cursor.fetchall()
        return shipments

    # Additional methods for updating and deleting shipments can be added here
