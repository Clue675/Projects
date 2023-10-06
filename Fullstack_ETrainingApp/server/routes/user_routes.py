from flask import Blueprint, request, jsonify
from app import db
from app.models.training_model import Training

bp = Blueprint('user', __name__)

@bp.route('/api/trainings', methods=['POST'])
def create_training():
    data = request.json
    new_training = Training(
        firstName=data['firstName'],
        lastName=data['lastName'],
        badgeNumber=data['badgeNumber'],
        title=data['title'],
        date=data['date'],
        trainer=data['trainer']
    )
    db.session.add(new_training)
    db.session.commit()
    return jsonify({"message": "New training record created"}), 201

@bp.route('/api/trainings', methods=['GET'])
def list_trainings():
    trainings = Training.query.all()
    return jsonify([t.serialize for t in trainings]), 200

@bp.route('/api/trainings/<int:id>', methods=['GET'])
def get_training(id):
    training = Training.query.get(id)
    if training is None:
        return jsonify({"message": "Training record not found"}), 404
    return jsonify(training.serialize), 200

@bp.route('/api/trainings/<int:id>', methods=['PUT'])
def update_training(id):
    data = request.json
    training = Training.query.get(id)
    if training is None:
        return jsonify({"message": "Training record not found"}), 404
    
    training.firstName = data['firstName']
    training.lastName = data['lastName']
    training.badgeNumber = data['badgeNumber']
    training.title = data['title']
    training.date = data['date']
    training.trainer = data['trainer']
    
    db.session.commit()
    return jsonify({"message": "Training record updated successfully"}), 200

@bp.route('/api/trainings/<int:id>', methods=['DELETE'])
def delete_training(id):
    training = Training.query.get(id)
    if training is None:
        return jsonify({"message": "Training record not found"}), 404
    
    db.session.delete(training)
    db.session.commit()
    return jsonify({"message": "Training record deleted successfully"}), 200
