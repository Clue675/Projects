# Flask route in shipment_routes.py

from flask import Blueprint, request, jsonify
from ..services.shipment_services import ShipmentService

shipment_bp = Blueprint('shipment_bp', __name__)

@shipment_bp.route('/api/shipments', methods=['GET'])
def get_shipments():
    """Get all shipment records."""
    shipments = ShipmentService.get_all_shipments()
    return jsonify([shipment.to_dict() for shipment in shipments]), 200

@shipment_bp.route('/api/shipments', methods=['POST'])
def add_shipment():
    """Add a new shipment."""
    data = request.json
    shipment = ShipmentService.add_shipment(data)
    return jsonify(shipment.to_dict()), 201

@shipment_bp.route('/api/shipments/<int:shipment_id>', methods=['PUT'])
def update_shipment(shipment_id):
    """Update an existing shipment."""
    data = request.json
    shipment = ShipmentService.update_shipment(shipment_id, data)
    if shipment:
        return jsonify(shipment.to_dict()), 200
    return jsonify({'message': 'Shipment not found'}), 404

@shipment_bp.route('/api/shipments/<int:shipment_id>', methods=['DELETE'])
def delete_shipment(shipment_id):
    """Delete a shipment."""
    success = ShipmentService.delete_shipment(shipment_id)
    if success:
        return jsonify({'message': 'Shipment deleted'}), 200
    return jsonify({'message': 'Shipment not found'}), 404
