# Permacore/Backend/services/supplier_quality_services.py

from ..models.supplier_quality import SupplierQuality
from ..utils.database import db

class SupplierQualityService:

    @staticmethod
    def get_all_supplier_quality_records():
        """Retrieve all supplier quality records."""
        return SupplierQuality.query.all()

    @staticmethod
    def get_supplier_quality_by_id(supplier_id):
        """Retrieve a single supplier quality record by supplier ID."""
        return SupplierQuality.query.filter_by(id=supplier_id).first()

    @staticmethod
    def update_supplier_quality(supplier_id, updated_data):
        """Update a supplier quality record."""
        supplier_quality = SupplierQuality.query.filter_by(id=supplier_id).first()
        if not supplier_quality:
            return None

        supplier_quality.quality_rating = updated_data.get('quality_rating', supplier_quality.quality_rating)
        # Update other fields as needed

        db.session.commit()
        return supplier_quality

    @staticmethod
    def add_new_supplier_quality(new_data):
        """Add a new supplier quality record."""
        new_supplier_quality = SupplierQuality(
            quality_rating=new_data['quality_rating'],
            # Add other fields as needed
        )
        db.session.add(new_supplier_quality)
        db.session.commit()
        return new_supplier_quality

    @staticmethod
    def delete_supplier_quality(supplier_id):
        """Delete a supplier quality record."""
        supplier_quality = SupplierQuality.query.get(supplier_id)
        if supplier_quality:
            db.session.delete(supplier_quality)
            db.session.commit()
            return True
        return False
