# Permacore/Backend/routes/certification_routes.py

from flask import Blueprint, jsonify, request
from ..utils.database import db
from ..models.certification import Certification
from datetime import datetime

certification_bp = Blueprint('certification_bp', __name__)

@certification_bp.route('/', methods=['GET'])
def get_certifications():
    certifications = Certification.query.all()
    return jsonify([{
        'id': certification.id,
        'vendor_id': certification.vendor_id,
        'certificate_name': certification.certificate_name,
        'certificate_text': certification.certificate_text,
        'issued_date': certification.issued_date.strftime('%Y-%m-%d') if certification.issued_date else None,
        'issued_by': certification.issued_by,
        'expiration_date': certification.expiration_date.strftime('%Y-%m-%d') if certification.expiration_date else None,
        'file_reference': certification.file_reference,
        'notes': certification.notes,
        'created_at': certification.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': certification.updated_at.strftime('%Y-%m-%d %H:%M:%S') if certification.updated_at else None
    } for certification in certifications]), 200

@certification_bp.route('/', methods=['POST'])
def add_certification():
    data = request.json
    new_certification = Certification(
        vendor_id=data['vendor_id'],
        certificate_name=data['certificate_name'],
        certificate_text=data.get('certificate_text', ''),
        issued_date=datetime.strptime(data.get('issued_date', ''), '%Y-%m-%d') if data.get('issued_date') else None,
        issued_by=data.get('issued_by', ''),
        expiration_date=datetime.strptime(data.get('expiration_date', ''), '%Y-%m-%d') if data.get('expiration_date') else None,
        file_reference=data.get('file_reference', ''),
        notes=data.get('notes', '')
    )
    db.session.add(new_certification)
    db.session.commit()
    return jsonify({'message': 'New certification added', 'id': new_certification.id}), 201

@certification_bp.route('/<int:certification_id>', methods=['PUT'])
def update_certification(certification_id):
    certification = Certification.query.get_or_404(certification_id)
    data = request.json
    certification.certificate_name = data.get('certificate_name', certification.certificate_name)
    # Update other fields as necessary
    db.session.commit()
    return jsonify({'message': 'Certification updated', 'id': certification.id}), 200

@certification_bp.route('/<int:certification_id>', methods=['DELETE'])
def delete_certification(certification_id):
    certification = Certification.query.get_or_404(certification_id)
    db.session.delete(certification)
    db.session.commit()
    return jsonify({'message': 'Certification deleted'}), 200
