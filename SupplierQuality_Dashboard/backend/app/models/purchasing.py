import psycopg2
from app.utils.postgres import create_server_connection


class PurchasingOrder:
    def __init__(self, order_id, vendor_id, part_number, part_name, revision, material, workorder_number, quantity, status, promised_date, delivered_date=None):
        self.order_id = order_id
        self.vendor_id = vendor_id
        self.part_number = part_number
        self.part_name = part_name
        self.revision = revision
        self.material = material
        self.workorder_number = workorder_number
        self.quantity = quantity
        self.status = status
        self.promised_date = promised_date
        self.delivered_date = delivered_date

    @staticmethod
    def create_new_order(order_details):
        connection = create_server_connection()
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO purchasing_orders (order_id, vendor_id, part_number, part_name, revision, material, workorder_number, quantity, status, promised_date, delivered_date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    order_details['order_id'],
                    order_details['vendor_id'],
                    order_details['part_number'],
                    order_details['part_name'],
                    order_details['revision'],
                    order_details['material'],
                    order_details['workorder_number'],
                    order_details['quantity'],
                    order_details['status'],
                    order_details['promised_date'],
                    order_details.get('delivered_date', None)
                ))
            connection.commit()

    @staticmethod
    def get_all_orders():
        connection = create_server_connection()
        orders = []
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM purchasing_orders")
                orders = cursor.fetchall()
        return orders

    # Add more methods as needed for handling orders
