# Permacore/Backend/routes/supplier_quality_routes.py
from flask import Blueprint, jsonify, request
from ..utils.database import db
from ..models.supplier_quality import SupplierQuality
# from datetime import datetime

supplier_quality_bp = Blueprint('supplier_quality_bp', __name__)

@supplier_quality_bp.route('/', methods=['GET'])
def get_supplier_quality_records():
    records = SupplierQuality.query.all()
    return jsonify([{
        'id': record.id,
        'vendor_id': record.vendor_id,
        'quality_rating': record.quality_rating,
        'delivery_rating': record.delivery_rating,
        'overall_rating': record.overall_rating,
        'quality_category': record.quality_category,
        'delivery_category': record.delivery_category,
        'overall_category': record.overall_category,
        'quality_color': record.quality_color,
        'delivery_color': record.delivery_color,
        'overall_color': record.overall_color,
        'record_date': record.record_date.strftime('%Y-%m-%d') if record.record_date else None,
        'notes': record.notes
    } for record in records]), 200

@supplier_quality_bp.route('/', methods=['POST'])
def add_supplier_quality_record():
    data = request.json
    new_record = SupplierQuality(
        vendor_id=data['vendor_id'],
        quality_rating=data.get('quality_rating', 0.0),
        # Include other fields from data
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'New supplier quality record added', 'id': new_record.id}), 201

@supplier_quality_bp.route('/<int:record_id>', methods=['PUT'])
def update_supplier_quality_record(record_id):
    record = SupplierQuality.query.get_or_404(record_id)
    data = request.json
    record.quality_rating = data.get('quality_rating', record.quality_rating)
    # Update other fields as necessary
    db.session.commit()
    return jsonify({'message': 'Supplier quality record updated', 'id': record.id}), 200

@supplier_quality_bp.route('/<int:record_id>', methods=['DELETE'])
def delete_supplier_quality_record(record_id):
    record = SupplierQuality.query.get_or_404(record_id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Supplier quality record deleted'}), 200
