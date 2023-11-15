from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta
import os
import psycopg2
import psycopg2.extras
from validate_email import validate_email
from password_strength import PasswordPolicy

auth_blueprint = Blueprint('auth', __name__)

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

def email_exists(email):
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        return cursor.fetchone() is not None

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username', '')  # Optional username

    if not email or not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    policy = PasswordPolicy.from_names(
        length=8, uppercase=1, numbers=1, special=1
    )

    if policy.test(password):
        return jsonify({'error': 'Password does not meet complexity requirements'}), 400

    if email_exists(email):
        return jsonify({'error': 'Email already in use'}), 409

    hashed_password = generate_password_hash(password)
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (email, password, username) 
                VALUES (%s, %s, %s)
            """, (email, hashed_password, username))
            conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            if user and check_password_hash(user['password'], password):
                access_token = create_access_token(identity={'user_id': user['id']}, expires_delta=timedelta(days=1))
                return jsonify({'message': 'Logged in successfully', 'access_token': access_token}), 200
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
