from ..models.inspection import Inspection
from ..models.shipment import Shipment
from ..models.supplier_quality import SupplierQuality
from ..utils.database import db
from datetime import datetime

class InspectionService:
    @staticmethod
    def get_all_inspections():
        return Inspection.query.all()

    @staticmethod
    def add_inspection(data):
        """Add a new inspection and calculate vendor performance."""
        new_inspection = Inspection(
            vendor_id=data['vendor_id'],
            order_id=data['order_id'],
            line_item_number=data['line_item_number'],
            inspection_date=data.get('inspection_date', datetime.utcnow()),
            inspector_name=data['inspector_name'],
            total_parts_received=data['total_parts_received'],
            total_parts_accepted=data['total_parts_accepted'],
            total_parts_rejected=data['total_parts_rejected'],
            notes=data.get('notes', ''),
            rejection_details=data.get('rejection_details', ''),
            discrepancy_report_id=data.get('discrepancy_report_id', ''),
            work_order_number=data.get('work_order_number', ''),
            comments=data.get('comments', ''),
            quantity_accepted=data.get('quantity_accepted', 0),
            quantity_rejected=data.get('quantity_rejected', 0),
            rejection_code_id=data.get('rejection_code_id')
        )
        db.session.add(new_inspection)
        db.session.commit()
        InspectionService.calculate_and_store_vendor_performance(new_inspection.vendor_id)
        return new_inspection

    @staticmethod
    def update_inspection(inspection_id, data):
        """Update an existing inspection and recalculate vendor performance."""
        inspection = Inspection.query.get(inspection_id)
        if inspection:
            # Update inspection fields with data...
            db.session.commit()
            InspectionService.calculate_and_store_vendor_performance(inspection.vendor_id)
            return inspection
        return None

    @staticmethod
    def calculate_and_store_vendor_performance(vendor_id):
        """Calculate and store vendor performance based on inspections and shipments."""
        inspections = Inspection.query.filter_by(vendor_id=vendor_id).all()
        shipments = Shipment.query.filter_by(vendor_id=vendor_id).all()

        quality_score = InspectionService.calculate_quality_score(inspections)
        delivery_score = InspectionService.calculate_delivery_score(shipments)

        InspectionService.insert_vendor_performance(vendor_id, quality_score, delivery_score, "Auto-generated performance record")

    # Existing methods calculate_quality_score, calculate_delivery_score, categorize_performance, and insert_vendor_performance

    # ... Additional methods as needed ...
