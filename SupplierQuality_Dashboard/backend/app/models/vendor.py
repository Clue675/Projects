import psycopg2
from database import create_server_connection
from datetime import datetime

class Vendor:
    def __init__(self, vendor_id, vendor_name, contact_info, performance_score, status, last_audit_date, next_audit_date, comments):
        self.vendor_id = vendor_id
        self.vendor_name = vendor_name
        self.contact_info = contact_info
        self.performance_score = performance_score
        self.status = status
        self.last_audit_date = last_audit_date
        self.next_audit_date = next_audit_date
        self.comments = comments

    def serialize(self):
        """Converts object data to a dictionary for easy JSON serialization."""
        return {
            'vendor_id': self.vendor_id,
            'vendor_name': self.vendor_name,
            'contact_info': self.contact_info,
            'performance_score': self.performance_score,
            'status': self.status,
            'last_audit_date': self.last_audit_date,
            'next_audit_date': self.next_audit_date,
            'comments': self.comments
        }

def add_vendor(vendor_data):
    """Add a new vendor to the database."""
    connection = create_server_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO vendors (vendor_name, contact_info, performance_score, status, last_audit_date, next_audit_date, comments) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING vendor_id;
            """, (
                vendor_data['vendor_name'],
                vendor_data['contact_info'],
                vendor_data['performance_score'],
                vendor_data['status'],
                vendor_data['last_audit_date'],
                vendor_data['next_audit_date'],
                vendor_data['comments']
            ))
            new_id = cursor.fetchone()[0]
            connection.commit()
            return new_id

def get_vendor(vendor_id):
    """Retrieve a vendor by their ID."""
    connection = create_server_connection()
    vendor = None
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM vendors WHERE vendor_id = %s;", (vendor_id,))
            vendor_data = cursor.fetchone()
            if vendor_data:
                vendor = Vendor(*vendor_data)
    return vendor

# Additional functions can be defined here for updating, deleting, or querying vendors
