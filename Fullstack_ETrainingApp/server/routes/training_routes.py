from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from passlib.hash import pbkdf2_sha256
from server.app import sql_db as db  # Updated import statement
from server.models.training_model import Training


bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    hashed_password = pbkdf2_sha256.hash(password)
    
    # Create a new user model object
    new_user = Training(username=username, password=hashed_password)
    
    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Search for the user in the database
    user = Training.query.filter_by(username=username).first()
    
    if user and pbkdf2_sha256.verify(password, user.password):
        access_token = create_access_token(identity=username)
        return jsonify({"message": "Login successful", "access_token": access_token}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

@bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    return jsonify({"message": "Token is valid"}), 200

