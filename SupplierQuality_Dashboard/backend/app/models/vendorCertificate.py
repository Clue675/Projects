import psycopg2
from database import create_server_connection
from datetime import datetime

class VendorCertificate:
    def __init__(self, id, vendor_id, certificate_name, certificate_text, issued_date, issued_by, expiration_date, file_reference, notes):
        self.id = id
        self.vendor_id = vendor_id
        self.certificate_name = certificate_name
        self.certificate_text = certificate_text
        self.issued_date = issued_date
        self.issued_by = issued_by
        self.expiration_date = expiration_date
        self.file_reference = file_reference
        self.notes = notes

    def serialize(self):
        """Converts object data to a dictionary for easy JSON serialization."""
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'certificate_name': self.certificate_name,
            'certificate_text': self.certificate_text,
            'issued_date': self.issued_date,
            'issued_by': self.issued_by,
            'expiration_date': self.expiration_date,
            'file_reference': self.file_reference,
            'notes': self.notes
        }

def add_vendor_certificate(cert_data):
    """Add a new vendor certificate to the database."""
    connection = create_server_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO vendor_certificates (vendor_id, certificate_name, certificate_text, issued_date, issued_by, expiration_date, file_reference, notes) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                cert_data['vendor_id'],
                cert_data['certificate_name'],
                cert_data['certificate_text'],
                cert_data['issued_date'],
                cert_data['issued_by'],
                cert_data['expiration_date'],
                cert_data['file_reference'],
                cert_data['notes']
            ))
            new_id = cursor.fetchone()[0]
            connection.commit()
            return new_id

def get_vendor_certificate(certificate_id):
    """Retrieve a vendor certificate by its ID."""
    connection = create_server_connection()
    certificate = None
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM vendor_certificates WHERE id = %s;", (certificate_id,))
            cert_data = cursor.fetchone()
            if cert_data:
                certificate = VendorCertificate(*cert_data)
    return certificate

# You can add more functions for updating, deleting, or querying vendor certificates
