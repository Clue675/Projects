from flask import Blueprint, request, jsonify
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta
from app.utils.db_connection import create_server_connection
import logging

# Create a Flask Blueprint for the authentication module
auth_blueprint = Blueprint('auth', __name__)

# Apply detailed CORS settings to this blueprint
# - origins: specify allowed origins (use "*" to allow all)
# - methods: list allowed HTTP methods
# - allow_headers: specify headers that can be used in the actual request
# - supports_credentials: allow the inclusion of credentials like cookies, HTTP authentication
CORS(auth_blueprint, resources={
    r"/*": {
        "origins": "*", 
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
        "supports_credentials": True
    }
})

# Route for user registration
@auth_blueprint.route('/register', methods=['POST'])
def register():
    # Extract data from the incoming request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # ... other fields ...

    # Validation: Check for mandatory fields
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Connect to the database
    conn = create_server_connection()
    try:
        # Check if email already exists
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({'error': 'Email already exists'}), 409

        # Hash password for security
        hashed_password = generate_password_hash(password)

        # Insert new user into the database
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (email, password, ...)
                VALUES (%s, %s, ...)
            """, (email, hashed_password, ...))
            conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        logging.error(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        conn.close()

# Route for user login
@auth_blueprint.route('/login', methods=['POST'])
def login():
    # Extract email and password from request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Connect to database
    conn = create_server_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, password FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

        # Validate password and create JWT token if valid
        if user and check_password_hash(user['password'], password):
            access_token = create_access_token(identity={'user_id': user['id']}, expires_delta=timedelta(days=1))
            return jsonify({'message': 'Logged in successfully', 'access_token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except Exception as e:
        logging.error(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        conn.close()
