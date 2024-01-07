from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash
from app.utils.db_connection import create_server_connection

class User:
    """
    User model class representing users in the system.
    """

    def __init__(self, id, email, password_hash, first_name=None, last_name=None, department=None, phone_number=None, alt_phone_number=None):
        """
        Initialize a new user instance.
        """
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
        """
        Retrieve a user by email from the database.

        :param email: Email address of the user.
        :return: A User instance if found, None otherwise.
        """
        conn = create_server_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user_data = cursor.fetchone()
            conn.close()
            return cls(**user_data) if user_data else None
        
    @classmethod
    def create(cls, email, password, first_name=None, last_name=None, department=None, phone_number=None, alt_phone_number=None):
        """
        Create a new user in the database.

        :param email: Email address of the user.
        :param password: Raw password to be hashed and stored.
        :param first_name: First name of the user.
        :param last_name: Last name of the user.
        :param department: Department of the user.
        :param phone_number: Phone number of the user.
        :param alt_phone_number: Alternate phone number of the user.
        """
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
        """
        Check if an email address already exists in the database.

        :param email: Email address to check.
        :return: True if email exists, False otherwise.
        """
        conn = create_server_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            exists = bool(cursor.fetchone())
            conn.close()
            return exists
