# Permacore/Backend/models/supplier_quality.py
from ..utils.database import db
from datetime import datetime

class SupplierQuality(db.Model):
    __tablename__ = 'supplier_quality'

    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    quality_rating = db.Column(db.Float)
    delivery_rating = db.Column(db.Float)
    overall_rating = db.Column(db.Float)
    quality_category = db.Column(db.String(50))
    delivery_category = db.Column(db.String(50))
    overall_category = db.Column(db.String(50))
    quality_color = db.Column(db.String(20))
    delivery_color = db.Column(db.String(20))
    overall_color = db.Column(db.String(20))
    record_date = db.Column(db.Date, default=datetime.utcnow)
    notes = db.Column(db.Text)

    def __repr__(self):
        return f'<SupplierQuality {self.id} - Vendor {self.vendor_id}>'
