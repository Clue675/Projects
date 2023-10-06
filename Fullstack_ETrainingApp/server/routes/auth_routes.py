from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from passlib.hash import pbkdf2_sha256
from server.app import sql_db as db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    work_center = data.get('work_center')
    access_level = data.get('access_level', 1)  # Default to 1 if not provided

    hashed_password = pbkdf2_sha256.hash(password)

    db.users.insert_one({
        "username": username,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "work_center": work_center,
        "access_level": access_level,
    })

    return jsonify({"message": "User registered successfully"})

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = db.users.find_one({"username": username})
    if user and pbkdf2_sha256.verify(password, user['password']):
        access_token = create_access_token(identity=username)
        return jsonify({"message": "Login successful", "access_token": access_token})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    return jsonify({"message": "Token is valid"})

@bp.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_token}), 200

@bp.route('/get-user-details', methods=['GET'])
@jwt_required()
def get_user_details():
    current_user = get_jwt_identity()
    user = db.users.find_one({"username": current_user})
    if user:
        return jsonify({
            "username": user.get('username'),
            "first_name": user.get('first_name'),
            "last_name": user.get('last_name'),
            "work_center": user.get('work_center'),
            "access_level": user.get('access_level')
        })
    else:
        return jsonify({"message": "User not found"}), 404
