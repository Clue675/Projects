# services/shipment_service.py

from ..models.shipment import Shipment
from ..utils.database import db

class ShipmentService:
    @staticmethod
    def get_all_shipments():
        """
        Retrieve all shipment records from the database.
        Returns a list of Shipment model instances.
        """
        return Shipment.query.all()

    @staticmethod
    def add_shipment(data):
        """
        Add a new shipment record to the database.
        data: Dictionary containing shipment information.
        Returns the newly created Shipment instance.
        """
        new_shipment = Shipment(
            vendor_id=data['vendor_id'],
            order_id=data['order_id'],
            part_number=data.get('part_number', ''),
            part_description=data.get('part_description', ''),
            expected_delivery_date=data.get('expected_delivery_date'),
            actual_delivery_date=data.get('actual_delivery_date'),
            date_received=data.get('date_received'),
            qty_received=data.get('qty_received', 0),
            qty_ordered=data.get('qty_ordered', 0),
            unit_cost=data.get('unit_cost', 0.0),
            notes=data.get('notes', ''),
            line_item=data.get('line_item', ''),
            vendor_name=data.get('vendor_name', ''),
            workorder_number=data.get('workorder_number', ''),
            rework_number=data.get('rework_number', ''),
            comments=data.get('comments', '')
        )
        new_shipment.calculate_delivery_on_time()
        new_shipment.calculate_accuracy()
        db.session.add(new_shipment)
        db.session.commit()
        return new_shipment

    @staticmethod
    def update_shipment(shipment_id, data):
        """
        Update an existing shipment record in the database.
        shipment_id: ID of the shipment to be updated.
        data: Dictionary containing updated shipment information.
        Returns the updated Shipment instance, or None if not found.
        """
        shipment = Shipment.query.get(shipment_id)
        if shipment:
            shipment.order_id = data.get('order_id', shipment.order_id)
            shipment.part_number = data.get('part_number', shipment.part_number)
            shipment.part_description = data.get('part_description', shipment.part_description)
            shipment.expected_delivery_date = data.get('expected_delivery_date', shipment.expected_delivery_date)
            shipment.actual_delivery_date = data.get('actual_delivery_date', shipment.actual_delivery_date)
            shipment.date_received = data.get('date_received', shipment.date_received)
            shipment.qty_received = data.get('qty_received', shipment.qty_received)
            shipment.qty_ordered = data.get('qty_ordered', shipment.qty_ordered)
            shipment.unit_cost = data.get('unit_cost', shipment.unit_cost)
            shipment.notes = data.get('notes', shipment.notes)
            shipment.line_item = data.get('line_item', shipment.line_item)
            shipment.vendor_name = data.get('vendor_name', shipment.vendor_name)
            shipment.workorder_number = data.get('workorder_number', shipment.workorder_number)
            shipment.rework_number = data.get('rework_number', shipment.rework_number)
            shipment.comments = data.get('comments', shipment.comments)
            shipment.calculate_delivery_on_time()
            shipment.calculate_accuracy()
            db.session.commit()
            return shipment
        return None

    @staticmethod
    def delete_shipment(shipment_id):
        """
        Delete a shipment record from the database.
        shipment_id: ID of the shipment to be deleted.
        Returns True if the deletion was successful, False otherwise.
        """
        shipment = Shipment.query.get(shipment_id)
        if shipment:
            db.session.delete(shipment)
            db.session.commit()
            return True
        return False

# Add additional service methods as needed
