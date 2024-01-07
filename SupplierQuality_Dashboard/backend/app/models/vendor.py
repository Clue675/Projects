import psycopg2
from app.utils.postgresql import create_server_connection
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

def get_vendor(search_criteria):
    """
    Retrieve vendors based on search criteria.
    search_criteria: Dictionary with keys like 'vendor_id', 'name', 'status'.
    """
    connection = create_server_connection()
    vendors = []

    query = "SELECT * FROM vendors WHERE "
    query_conditions = []
    query_values = []

    if 'vendor_id' in search_criteria:
        query_conditions.append("vendor_id = %s")
        query_values.append(search_criteria['vendor_id'])

    if 'name' in search_criteria:
        query_conditions.append("vendor_name LIKE %s")
        query_values.append("%" + search_criteria['name'] + "%")

    if 'status' in search_criteria:
        query_conditions.append("status = %s")
        query_values.append(search_criteria['status'])

    if not query_conditions:
        # If no search criteria, return all vendors
        query = "SELECT * FROM vendors;"
    else:
        query += " AND ".join(query_conditions)

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(query, tuple(query_values))
            for vendor_data in cursor.fetchall():
                vendors.append(Vendor(*vendor_data))

    return vendors

def update_vendor(vendor_id, updated_data):
    """
    Update a vendor's details in the database.
    """
    connection = create_server_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE vendors
                SET vendor_name = %s, contact_info = %s, performance_score = %s, 
                    status = %s, last_audit_date = %s, next_audit_date = %s, comments = %s
                WHERE vendor_id = %s;
            """, (
                updated_data['vendor_name'],
                updated_data['contact_info'],
                updated_data['performance_score'],
                updated_data['status'],
                updated_data['last_audit_date'],
                updated_data['next_audit_date'],
                updated_data['comments'],
                vendor_id
            ))
            connection.commit()

def get_all_vendors():
    """
    Retrieve all vendors from the database.
    """
    connection = create_server_connection()
    vendors = []
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM vendors;")
            for vendor_data in cursor.fetchall():
                vendors.append(Vendor(*vendor_data))
    return vendors


# Additional functions can be defined here for updating, deleting, or querying vendors
