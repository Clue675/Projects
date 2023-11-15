import psycopg2
from database import create_server_connection

class Shipments:
    def __init__(self, shipment_id, order_id, expected_delivery_date, actual_delivery_date, status, notes):
        self.shipment_id = shipment_id
        self.order_id = order_id
        self.expected_delivery_date = expected_delivery_date
        self.actual_delivery_date = actual_delivery_date
        self.status = status
        self.notes = notes

    @staticmethod
    def create_new_shipment(shipment_details):
        connection = create_server_connection()
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO shipments (order_id, expected_delivery_date, actual_delivery_date, status, notes)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    shipment_details['order_id'],
                    shipment_details['expected_delivery_date'],
                    shipment_details.get('actual_delivery_date', None),
                    shipment_details['status'],
                    shipment_details.get('notes', '')
                ))
            connection.commit()

    @staticmethod
    def get_all_shipments():
        connection = create_server_connection()
        shipments = []
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM shipments")
                shipments = cursor.fetchall()
        return shipments

    # Additional methods can be added as needed for other CRUD operations
