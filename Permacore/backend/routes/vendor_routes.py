from flask import Blueprint, request, jsonify
from backend.models.vendor import Vendor
from backend.utils.database import db
vendor_bp = Blueprint('vendor_bp', __name__)

@vendor_bp.route('/vendors', methods=['POST'])
def create_vendor():
    """Create a new vendor."""
    data = request.json
    new_vendor = Vendor(
        vendor_name=data.get('vendor_name'),
        email_address=data.get('email_address'),
        street_address=data.get('street_address'),
        city=data.get('city'),
        state=data.get('state'),
        zip_code=data.get('zip_code'),
        country=data.get('country'),
        phone_quality=data.get('phone_quality'),
        quality_rep_name=data.get('quality_rep_name'),
        phone_sales=data.get('phone_sales'),
        sales_rep_name=data.get('sales_rep_name'),
        phone_general=data.get('phone_general'),
        general_rep_name=data.get('general_rep_name'),
        rep_1_name=data.get('rep_1_name'),
        rep_1_number=data.get('rep_1_number'),
        rep_2_name=data.get('rep_2_name'),
        rep_2_number=data.get('rep_2_number'),
        rep_3_name=data.get('rep_3_name'),
        rep_3_number=data.get('rep_3_number'),
        rep_4_name=data.get('rep_4_name'),
        rep_4_number=data.get('rep_4_number'),
        rep_5_name=data.get('rep_5_name'),
        rep_5_number=data.get('rep_5_number'),
        performance_score=data.get('performance_score'),
        status=data.get('status'),
        risk_code=data.get('risk_code'),
        last_audit_date=data.get('last_audit_date'),
        next_audit_date=data.get('next_audit_date'),
        comments=data.get('comments')
    )
    db.session.add(new_vendor)
    db.session.commit()
    return jsonify(new_vendor.to_dict()), 201

@vendor_bp.route('/vendors/<int:vendor_id>', methods=['GET'])
def get_vendor(vendor_id):
    """Get a specific vendor by ID."""
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'message': 'Vendor not found'}), 404
    return jsonify(vendor.to_dict()), 200

@vendor_bp.route('/vendors', methods=['GET'])
def get_vendors():
    """Get all vendors."""
    vendors = Vendor.query.all()
    return jsonify([vendor.to_dict() for vendor in vendors]), 200

@vendor_bp.route('/vendors/<int:vendor_id>', methods=['PUT'])
def update_vendor(vendor_id):
    """Update a specific vendor by ID."""
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'message': 'Vendor not found'}), 404
    data = request.json
    vendor.vendor_name = data.get('vendor_name', vendor.vendor_name)
    # Update other fields similarly...
    db.session.commit()
    return jsonify(vendor.to_dict()), 200

@vendor_bp.route('/vendors/<int:vendor_id>', methods=['DELETE'])
def delete_vendor(vendor_id):
    """Delete a specific vendor by ID."""
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'message': 'Vendor not found'}), 404
    db.session.delete(vendor)
    db.session.commit()
    return jsonify({'message': 'Vendor deleted successfully'}), 200

# Additional routes and logic as needed...
