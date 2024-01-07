class VendorCertificate:
    def __init__(self, vendor_id, certificate_name, certificate_text, issued_date, issued_by, expiration_date, file_reference, notes, id=None):
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

    @staticmethod
    def add_certificate(conn, cert_data):
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO vendor_certificates 
                    (vendor_id, certificate_name, certificate_text, issued_date, issued_by, expiration_date, file_reference, notes) 
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
                return cursor.fetchone()[0]
        except Exception as e:
            # Handle the exception, log it, or raise it
            raise

    @staticmethod
    def get_certificate(conn, certificate_id):
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM vendor_certificates WHERE id = %s;", (certificate_id,))
                cert_data = cursor.fetchone()
                if cert_data:
                    return VendorCertificate(*cert_data).serialize()
            return None
        except Exception as e:
            # Handle the exception, log it, or raise it
            raise

    # Additional methods for updating and deleting certificates can be added here.
