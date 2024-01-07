from flask import Blueprint, request, jsonify
from ..services.inspection_service import InspectionService

inspection_bp = Blueprint('inspection_bp', __name__)

@inspection_bp.route('/inspections', methods=['GET'])
def get_inspections():
    inspections = InspectionService.get_all_inspections()
    return jsonify([inspection.to_dict() for inspection in inspections]), 200

@inspection_bp.route('/inspections', methods=['POST'])
def add_inspection():
    data = request.json
    inspection = InspectionService.add_inspection(data)
    return jsonify(inspection.to_dict()), 201

@inspection_bp.route('/inspections/<int:inspection_id>', methods=['PUT'])
def update_inspection(inspection_id):
    data = request.json
    inspection = InspectionService.update_inspection(inspection_id, data)
    if inspection:
        return jsonify(inspection.to_dict()), 200
    return jsonify({'message': 'Inspection not found'}), 404

@inspection_bp.route('/inspections/<int:inspection_id>', methods=['DELETE'])
def delete_inspection(inspection_id):
    success = InspectionService.delete_inspection(inspection_id)
    if success:
        return jsonify({'message': 'Inspection deleted'}), 200
    return jsonify({'message': 'Inspection not found'}), 404
