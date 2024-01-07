# Permacore/Backend/models/certification.py

from ..utils.database import db

from datetime import datetime

class Certification(db.Model):
    __tablename__ = 'certifications'

    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    certificate_name = db.Column(db.String(128), nullable=False)
    certificate_text = db.Column(db.Text)
    issued_date = db.Column(db.Date)
    issued_by = db.Column(db.String(128))
    expiration_date = db.Column(db.Date)
    file_reference = db.Column(db.String(256), unique=True)  # Reference to file location, ensure uniqueness
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Certification {self.certificate_name}>'

    # Additional methods as needed, for example:

    def to_dict(self):
        """Convert this certification to a dictionary format."""
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'certificate_name': self.certificate_name,
            'certificate_text': self.certificate_text,
            'issued_date': self.issued_date.strftime('%Y-%m-%d') if self.issued_date else None,
            'issued_by': self.issued_by,
            'expiration_date': self.expiration_date.strftime('%Y-%m-%d') if self.expiration_date else None,
            'file_reference': self.file_reference,
            'notes': self.notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None
        }
