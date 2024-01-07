# Permacore/Backend/models/vendor.py
from ..utils.database import db
from datetime import datetime

class Vendor(db.Model):
    __tablename__ = 'vendors'

    id = db.Column(db.Integer, primary_key=True)
    vendor_name = db.Column(db.String(128), nullable=False)
    email_address = db.Column(db.String(256))
    street_address = db.Column(db.String(256))  # Street address
    city = db.Column(db.String(100))  # City
    state = db.Column(db.String(100))  # State
    zip_code = db.Column(db.String(20))  # Zip code
    country = db.Column(db.String(100))  # Country

    # Phone numbers with associated representative names
    phone_quality = db.Column(db.String(20))
    quality_rep_name = db.Column(db.String(128))  # Name of quality representative
    phone_sales = db.Column(db.String(20))
    sales_rep_name = db.Column(db.String(128))  # Name of sales representative
    phone_general = db.Column(db.String(20))
    general_rep_name = db.Column(db.String(128))  # Name of general representative

    # Structured fields for up to 5 representatives (name and number)
    rep_1_name = db.Column(db.String(128))  # Name of 1st representative
    rep_1_number = db.Column(db.String(20))  # Contact number of 1st representative
    rep_2_name = db.Column(db.String(128))  # Name of 2nd representative
    rep_2_number = db.Column(db.String(20))  # Contact number of 2nd representative
    rep_3_name = db.Column(db.String(128))  # Name of 3rd representative
    rep_3_number = db.Column(db.String(20))  # Contact number of 3rd representative
    rep_4_name = db.Column(db.String(128))  # Name of 4th representative
    rep_4_number = db.Column(db.String(20))  # Contact number of 4th representative
    rep_5_name = db.Column(db.String(128))  # Name of 5th representative
    rep_5_number = db.Column(db.String(20))  # Contact number of 5th representative

    performance_score = db.Column(db.Float)
    status = db.Column(db.String(50), default='Active')
    risk_code = db.Column(db.String(50))
    last_audit_date = db.Column(db.Date)
    next_audit_date = db.Column(db.Date)
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Relationship to Certifications
    certifications = db.relationship('Certification', backref='vendor', lazy=True)

    def __repr__(self):
        return f'<Vendor {self.vendor_name}>'

    def to_dict(self):
        """Convert this vendor to a dictionary format."""
        return {
            'id': self.id,
            'vendor_name': self.vendor_name,
            'email_address': self.email_address,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'country': self.country,
            'phone_quality': self.phone_quality,
            'quality_rep_name': self.quality_rep_name,
            'phone_sales': self.phone_sales,
            'sales_rep_name': self.sales_rep_name,
            'phone_general': self.phone_general,
            'general_rep_name': self.general_rep_name,
            'rep_1_name': self.rep_1_name,
            'rep_1_number': self.rep_1_number,
            'rep_2_name': self.rep_2_name,
            'rep_2_number': self.rep_2_number,
            'rep_3_name': self.rep_3_name,
            'rep_3_number': self.rep_3_number,
            'rep_4_name': self.rep_4_name,
            'rep_4_number': self.rep_4_number,
            'rep_5_name': self.rep_5_name,
            'rep_5_number': self.rep_5_number,
            'performance_score': self.performance_score,
            'status': self.status,
            'risk_code': self.risk_code,
            'last_audit_date': self.last_audit_date,
            'next_audit_date': self.next_audit_date,
            'comments': self.comments,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
