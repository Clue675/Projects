# Permacore/Backend/models/inspection.py

from ..utils.database import db
from datetime import datetime

class Inspection(db.Model):
    __tablename__ = 'inspections'

    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, nullable=False)
    order_id = db.Column(db.String(128), nullable=False)
    line_item_number = db.Column(db.String(128))  # Added line item number
    inspection_date = db.Column(db.DateTime, default=datetime.utcnow)
    inspector_name = db.Column(db.String(128))
    total_parts_received = db.Column(db.Integer)
    total_parts_accepted = db.Column(db.Integer)
    total_parts_rejected = db.Column(db.Integer)
    notes = db.Column(db.Text)
    rejection_details = db.Column(db.Text)
    discrepancy_report_id = db.Column(db.String(128))
    work_order_number = db.Column(db.String(128))
    comments = db.Column(db.Text)
    quantity_accepted = db.Column(db.Integer)
    quantity_rejected = db.Column(db.Integer)
    rejection_code_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Inspection {self.id}>'

    def to_dict(self):
        """Convert this inspection to a dictionary format."""
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'order_id': self.order_id,
            'line_item_number': self.line_item_number,
            'inspection_date': self.inspection_date.strftime('%Y-%m-%d %H:%M:%S') if self.inspection_date else None,
            'inspector_name': self.inspector_name,
            'total_parts_received': self.total_parts_received,
            'total_parts_accepted': self.total_parts_accepted,
            'total_parts_rejected': self.total_parts_rejected,
            'notes': self.notes,
            'rejection_details': self.rejection_details,
            'discrepancy_report_id': self.discrepancy_report_id,
            'work_order_number': self.work_order_number,
            'comments': self.comments,
            'quantity_accepted': self.quantity_accepted,
            'quantity_rejected': self.quantity_rejected,
            'rejection_code_id': self.rejection_code_id,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None
        }
