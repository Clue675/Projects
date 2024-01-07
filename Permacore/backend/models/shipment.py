from ..utils.database import db
from datetime import datetime

class Shipment(db.Model):
    __tablename__ = 'shipments'

    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, nullable=False)
    order_id = db.Column(db.String(128), nullable=False)
    part_number = db.Column(db.String(128))
    part_description = db.Column(db.Text)
    expected_delivery_date = db.Column(db.Date)
    actual_delivery_date = db.Column(db.Date)
    date_received = db.Column(db.Date)
    is_delivered_on_time = db.Column(db.Boolean)  # Automatically calculated
    is_accurate = db.Column(db.Boolean)  # Automatically calculated
    notes = db.Column(db.Text)
    line_item = db.Column(db.String(128))
    vendor_name = db.Column(db.String(128))
    workorder_number = db.Column(db.String(128))
    rework_number = db.Column(db.String(128))
    qty_received = db.Column(db.Integer)  # Used in automatic calculation
    qty_ordered = db.Column(db.Integer)  # Used in automatic calculation
    unit_cost = db.Column(db.Float)
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def calculate_delivery_on_time(self):
        """ Calculate if shipment is delivered on time """
        if self.expected_delivery_date and self.actual_delivery_date:
            self.is_delivered_on_time = self.actual_delivery_date <= self.expected_delivery_date
        else:
            self.is_delivered_on_time = None

    def calculate_accuracy(self):
        """ Calculate if shipment quantity is accurate """
        if self.qty_ordered and self.qty_received:
            self.is_accurate = self.qty_received == self.qty_ordered
        else:
            self.is_accurate = None

    def to_dict(self):
        """Convert the Shipment instance to a dictionary for easy JSON serialization."""
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'order_id': self.order_id,
            'part_number': self.part_number,
            'part_description': self.part_description,
            'expected_delivery_date': self.expected_delivery_date,
            'actual_delivery_date': self.actual_delivery_date,
            'date_received': self.date_received,
            'is_delivered_on_time': self.is_delivered_on_time,
            'is_accurate': self.is_accurate,
            'notes': self.notes,
            'line_item': self.line_item,
            'vendor_name': self.vendor_name,
            'workorder_number': self.workorder_number,
            'rework_number': self.rework_number,
            'qty_received': self.qty_received,
            'qty_ordered': self.qty_ordered,
            'unit_cost': self.unit_cost,
            'comments': self.comments,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Event listeners for automatic calculations
db.event.listen(Shipment.actual_delivery_date, 'set', Shipment.calculate_delivery_on_time)
db.event.listen(Shipment.qty_received, 'set', Shipment.calculate_accuracy)

# Additional methods and logic as needed
