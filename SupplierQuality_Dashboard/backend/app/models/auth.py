# models/user.py
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash
# Import the database connection utility
from app.utils.db_connection import create_server_connection


class User:
    def __init__(self, id, email, password_hash, first_name=None, last_name=None, department=None, phone_number=None, alt_phone_number=None):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.department = department
        self.phone_number = phone_number
        self.alt_phone_number = alt_phone_number

    @classmethod
    def get_user_by_email(cls, email):
        conn = create_server_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT id, email, password AS password_hash, first_name, last_name, department, phone_number, alt_phone_number FROM users WHERE email = %s", (email,))
            user_data = cursor.fetchone()
            conn.close()
            return cls(**user_data) if user_data else None

    @classmethod
    def create(cls, email, password, first_name=None, last_name=None, department=None, phone_number=None, alt_phone_number=None):
        hashed_password = generate_password_hash(password)
        conn = create_server_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (email, password, first_name, last_name, department, phone_number, alt_phone_number) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (email, hashed_password, first_name, last_name, department, phone_number, alt_phone_number))
            conn.commit()
            conn.close()

    @classmethod
    def email_exists(cls, email):
        conn = create_server_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            exists = bool(cursor.fetchone())
            conn.close()
            return exists
