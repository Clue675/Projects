from flask import Blueprint, request, jsonify
from ..services.rejection_code_service import RejectionCodeService

rejection_code_bp = Blueprint('rejection_code_bp', __name__)

@rejection_code_bp.route('/api/rejection_codes', methods=['POST'])
def add_rejection_code():
    data = request.json
    rejection_code = RejectionCodeService.create_rejection_code(data)
    return jsonify(rejection_code), 201

@rejection_code_bp.route('/api/rejection_codes', methods=['GET'])
def get_rejection_codes():
    rejection_codes = RejectionCodeService.get_all_rejection_codes()
    return jsonify([code.__dict__ for code in rejection_codes]), 200

@rejection_code_bp.route('/api/rejection_codes/<int:code_id>', methods=['PUT'])
def update_rejection_code(code_id):
    data = request.json
    rejection_code = RejectionCodeService.update_rejection_code(code_id, data)
    if rejection_code:
        return jsonify(rejection_code), 200
    return jsonify({"message": "Rejection code not found"}), 404

@rejection_code_bp.route('/api/rejection_codes/<int:code_id>', methods=['DELETE'])
def delete_rejection_code(code_id):
    if RejectionCodeService.delete_rejection_code(code_id):
        return jsonify({"message": "Rejection code deleted"}), 200
    return jsonify({"message": "Rejection code not found"}), 404
