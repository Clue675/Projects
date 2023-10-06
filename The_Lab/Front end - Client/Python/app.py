from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from passlib.hash import pbkdf2_sha256
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import openpyxl

# Load environment variables
load_dotenv()

# Initialize the Flask application and set the secret key
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.environ.get('MY_SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY")
app.config['UPLOAD_FOLDER'] = '../uploads/'

# Initialize JWT
jwt = JWTManager(app)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']
users = db['users']

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    plain_password = data.get('password')
    
    if not username or not plain_password:
        return jsonify({"error": "Username and password are required"}), 400
    
    hashed_password = pbkdf2_sha256.hash(plain_password)
    users.insert_one({"username": username, "password": hashed_password})
    
    return jsonify({"message": "User registered successfully"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    user = users.find_one({"username": username})
    
    if user and pbkdf2_sha256.verify(password, user['password']):
        access_token = create_access_token(identity=username)
        return jsonify({"message": "Logged in", "access_token": access_token})
    else:
        return jsonify({"error": "Invalid login"}), 401

# Utility function to update Excel file
def update_excel_file(title, date, trainer, names):
    file_path = "./shared/Employee_database.xlsx"
    wb = openpyxl.load_workbook(file_path)
    ws = wb["EmployeeSheet1"]
    
    for name in names:
        ws.append([
            name.get('first_name', ''),
            name.get('last_name', ''),
            name.get('badge_number', ''),
            '',
            title,
            trainer,
            date
        ])
    
    wb.save(file_path)

# Utility function to parse the uploaded file
def parse_uploaded_file(file):
    # For demonstration, just return a mock list
    # Implement your own logic to parse the file and extract names and badge numbers
    return [
        {'first_name': 'Luke', 'last_name': 'Skywalker', 'badge_number': '12345'},
        {'first_name': 'Leia', 'last_name': 'Organa', 'badge_number': '67890'}
    ]

@app.route('/upload', methods=['POST'])
@jwt_required()  # Require JWT token to access this route
def upload_file():
    # Validate the file, title, date, and trainer
    # ...
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Parse the uploaded file to get names and badge numbers
        names = parse_uploaded_file(filepath)

        # Get the title, date, and trainer from the request (replace these with actual values)
        data = request.json
        title = data.get('title')
        date = data.get('date')
        trainer = data.get('trainer')


        # Update the Excel file
        update_excel_file(title, date, trainer, names)

        return jsonify({"message": "File uploaded and data updated"}), 200

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return "You've hit " + path + " and it doesn't exist.", 404
