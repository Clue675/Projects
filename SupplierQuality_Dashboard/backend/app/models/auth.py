from werkzeug.security import generate_password_hash
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# User class to represent user records
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

# Function to create a new user
def create_user(email, password, first_name=None, last_name=None, department=None, phone_number=None, alt_phone_number=None):
    hashed_password = generate_password_hash(password)  # Use default hash method
    connection = psycopg2.connect(os.getenv('DATABASE_URL'))
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (email, password, first_name, last_name, department, phone_number, alt_phone_number) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (email, hashed_password, first_name, last_name, department, phone_number, alt_phone_number))
            connection.commit()

# Function to check if email already exists in the database
def email_exists(email):
    connection = psycopg2.connect(os.getenv('DATABASE_URL'))
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            return bool(cursor.fetchone())

# Login function
def login_user(email, password):
    user = get_user_by_email(email)
    if user and check_password_hash(user.password_hash, password):
        return True  # Login successful
    return False  # Login failed, incorrect email or password

# Registration function
def register_user(email, password, first_name=None, last_name=None, department=None, phone_number=None, alt_phone_number=None):
    if email_exists(email):
        return False  # Email already exists, return error or appropriate response

    create_user(email, password, first_name, last_name, department, phone_number, alt_phone_number)
    return True  # Registration successful

# Other necessary functions...
