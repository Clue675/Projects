from flask import Flask, jsonify, request, make_response, current_app
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from openpyxl import load_workbook, Workbook
from bson import ObjectId
import pythoncom
import os
import logging
import re
import traceback

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['UPLOAD_FOLDER'] = './Training Logs'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'docx'}
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trainings.db'

# Initialize SQLAlchemy
sql_db = SQLAlchemy(app)

# Initialize Migrate
migrate = Migrate(app, sql_db)

# Initialize JWT
jwt = JWTManager(app)
jwt._set_error_handler_callbacks(app)


# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
mongo_db = client['my_database']
users = mongo_db['users']
users_collection = users


# SQLAlchemy model for Training
class Training(sql_db.Model):
    id = sql_db.Column(sql_db.Integer, primary_key=True)
    firstName = sql_db.Column(sql_db.String(50))
    lastName = sql_db.Column(sql_db.String(50))
    badgeNumber = sql_db.Column(sql_db.String(50))
    title = sql_db.Column(sql_db.String(100))
    date = sql_db.Column(sql_db.String(50))
    trainer = sql_db.Column(sql_db.String(50))

    @property
    def serialize(self):
        return {
            'id': self.id,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'badgeNumber': self.badgeNumber,
            'title': self.title,
            'date': self.date,
            'trainer': self.trainer
        }


def read_from_excel(query):
    wb = load_workbook(os.getenv('EXCEL_FILE_PATH'))
    ws = wb['EmployeeSheet1']
    results = []
    for row in ws.iter_rows(values_only=True):
        if query.lower() in str(row).lower():
            results.append({
                "First Name": row[0],
                "Last Name": row[1],
                "Badge Number": row[2],
                "Training Title": row[3],
                "Trainer": row[4],
                "Date": row[5],
                "Work Center": row[6]  # Placeholder or actual value
            })
    return results

#Debugging  Section 

# Debugging Token in Flask
def generate_token(user_id):
    try:
        token = jwt.encode({'id': user_id}, app.config['SECRET_KEY'])
        print(f"Generated Token: {token}")  # Debugging line
        return token
    except Exception as e:
        return None
#Debugging Home

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Flask is running!"}), 200

# ADD ROUTES HERE

#Verify Token
@app.route('/verify-token', methods=['GET'])
@cross_origin()  # This will enable CORS for this route
@jwt_required()
def verify_token():
    return jsonify({"message": "Token is valid"}), 200


@app.route('/register', methods=['POST'])
@cross_origin()  # This will enable CORS for this route
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    work_center = data.get('work_center')
    access_level = data.get('access_level', 1)  # Default to 1 if not provided

    hashed_password = pbkdf2_sha256.hash(password)

    users.insert_one({
        "username": username,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "work_center": work_center,
        "access_level": access_level,
    })

    return jsonify({"message": "User registered successfully"})


@app.route('/login', methods=['POST'])
@cross_origin()  # This will enable CORS for this route
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = users.find_one({"username": username})
    if pbkdf2_sha256.verify(password, user['password']):
        access_token = create_access_token(identity=username)
        return jsonify({"message": "Login successful", "access_token": access_token})
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route('/token/refresh', methods=['POST'])
@cross_origin()  # This will enable CORS for this route
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_token), 200

@app.route('/restricted_page')
def restricted_page():
    current_user = get_jwt_identity()
    if current_user['access_level'] < 2:
        return jsonify({"message": "Access denied"}), 403
    return jsonify({"message": "Welcome to the restricted page"})


logging.basicConfig(filename='debug.log', level=logging.DEBUG)

# Function to update Excel file


def update_excel_with_new_training(training):
    wb = load_workbook(os.getenv('EXCEL_FILE_PATH'))
    ws = wb['EmployeeSheet1']
    new_row = [
        training['firstName'],
        training['lastName'],
        training['badgeNumber'],
        training.get('title', ""),  # Training Title
        training.get('trainer', ""),  # Trainer
        training['date'],
        ""  # Empty cell for Work Center
    ]
    ws.append(new_row)
    wb.save(os.getenv('EXCEL_FILE_PATH'))


@app.route('/api/addNewTraining', methods=['POST'])
def add_new_training():
    try:
        data = request.json
        logging.debug(f"Received data: {data}")

        new_training = Training(
            # Using get to avoid KeyError
            firstName=data.get('firstName', None),
            lastName=data.get('lastName', None),
            badgeNumber=data.get('badgeNumber', None),
            title=data.get('title', None),  # New field
            date=data.get('date', None),  # New field
            trainer=data.get('trainer', None)  # New field
        )
        # Validation before adding to database
        if None in [new_training.firstName, new_training.lastName, new_training.badgeNumber, new_training.title,
                    new_training.date, new_training.trainer]:
            logging.error("One or more required fields are missing.")
            return jsonify({"message": "One or more required fields are missing."}), 422

        sql_db.session.add(new_training)
        sql_db.session.commit()

        return jsonify({"message": "New training added"}), 201

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"message": "An error occurred while processing your request."}), 422


@app.route('/api/training-verification', methods=['GET'])
@cross_origin()  # This will enable CORS for this route
# @jwt_required()
def get_training_data():
    all_trainings = Training.query.all()
    return jsonify([training.serialize for training in all_trainings]), 200


@app.route('/search', methods=['GET'])
@jwt_required()
def search_training():
    query = request.args.get('query')
    results = read_from_excel(query)
    return jsonify({"message": f"Search results for query: {query}", "data": results})


@app.route('/getUsername', methods=['GET'])
@cross_origin()  # This will enable CORS for this route
@jwt_required()
def get_username():
    current_user = get_jwt_identity()
    user = users.find_one({"username": current_user})
    if user:
        return jsonify({"username": current_user, "first_name": user.get("first_name")}), 200
    else:
        return jsonify({"error": "User not found"}), 404


@app.route('/api/users/level1_and_2', methods=['GET'])
@cross_origin()  # This will enable CORS for this route
@jwt_required()
def get_level1_and_2_users():
    current_user = get_jwt_identity()
    print("Debug: Inside /api/users/level1_and_2")
    print(f"Debug: Current User: {current_user}")
    
    current_user_data = users.find_one({"username": current_user})
    print(f"Debug: Current User Data: {current_user_data}")

    if current_user_data and str(current_user_data['access_level']) == '3':
        level1_and_2_users = users.find({"access_level": {"$in": [1, 2]}})
        level1_and_2_users_list = []
        for user in level1_and_2_users:
            user.pop('_id', None)
            level1_and_2_users_list.append(user)
        print(f"Debug: Returning users: {level1_and_2_users_list}")
        return jsonify({"success": True, "users": level1_and_2_users_list}), 200
    else:
        print("Debug: Unauthorized access")
        return jsonify({"success": False, "message": "Unauthorized"}), 401

@app.route('/api/users/update_access', methods=['POST'])
@cross_origin()  # This will enable CORS for this route
@jwt_required()
def update_user_access():
    current_user = get_jwt_identity()
    print("Debug: Inside /api/users/update_access")
    print(f"Debug: Current User: {current_user}")

    current_user_data = users.find_one({"username": current_user})
    print(f"Debug: Current User Data: {current_user_data}")

    data = request.json
    print(f"Debug: Received Data: {data}")  # Additional debugging

    if current_user_data and str(current_user_data['access_level']) == '3':
        target_username = data.get("username")
        new_access_level = data.get("new_access_level")
        print(f"Debug: Target Username: {target_username}, New Access Level: {new_access_level}")

        update_result = users.update_one(
            {"username": target_username, "access_level": {"$in": [1, 2]}},
            {"$set": {"access_level": new_access_level}}
        )
        print(f"Debug: Update Result: {update_result.modified_count}")

        if update_result.modified_count == 1:
            return jsonify({"success": True, "message": "Access level updated"}), 200
        else:
            return jsonify({"success": False, "message": "Update failed"}), 400
    else:
        print("Debug: Unauthorized access")
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
#Chart Timeline

@app.route('/api/training_timeline', methods=['GET'])
def training_timeline():
    # Load the Excel file
    df = pd.read_excel('Employee_database.xlsx')

    # Convert the 'Date' column to datetime format
    df['Date'] = pd.to_datetime(df['Date'])

    # Count the number of trainings on each date
    training_count = df.groupby('Date').size().reset_index(name='Count')

    # Convert the DataFrame to dictionary format for JSON response
    result = training_count.to_dict('records')

    return jsonify({"success": True, "data": result})

#Bar chart for training Count 
@app.route('/api/get_training_count', methods=['GET'])
def get_training_count():
    # Read the Excel file
    df = pd.read_excel('Employee_database.xlsx')

    # Group by 'Work Center' and count the number of trainings
    training_count = df['Work Center'].value_counts().reset_index()
    training_count.columns = ['Work Center', 'Count']

    # Convert the DataFrame to a dictionary
    training_count_dict = training_count.to_dict(orient='records')

    return jsonify(training_count_dict)

# CRUD API Routes

@app.route('/api/trainings', methods=['POST'])
@cross_origin()
@jwt_required()
def add_training():
    try:
        current_user = get_jwt_identity()
        data = request.json

        if None in [data.get(field) for field in ['firstName', 'lastName', 'badgeNumber', 'title', 'date', 'trainer']]:
            return jsonify({"message": "One or more required fields are missing."}), 422

        new_training = Training(**data)
        sql_db.session.add(new_training)
        sql_db.session.commit()

        return jsonify({"message": "New training added"}), 201

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"message": "An error occurred while processing your request."}), 422


@app.route('/api/trainings/<int:id>', methods=['PUT'])
def update_training(id):
    try:
        training = Training.query.get(id)
        if not training:
            return jsonify({"message": "Training not found"}), 404
        data = request.json
        for key, value in data.items():
            setattr(training, key, value)
        sql_db.session.commit()
        return jsonify({"message": "Training updated"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@app.route('/api/trainings/<int:id>', methods=['DELETE'])
def delete_training(id):
    try:
        training = Training.query.get(id)
        if not training:
            return jsonify({"message": "Training not found"}), 404
        sql_db.session.delete(training)
        sql_db.session.commit()
        return jsonify({"message": "Training deleted"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# GET USER NAME FOR SMART SHEET


@app.route('/api/getUserDetails', methods=['GET'])
@cross_origin()
@jwt_required()
def get_user_details():
    try:
        print("Inside getUserDetails API")
        current_user = get_jwt_identity()  # This should return the username
        print(f"Current User: {current_user}")

        if current_user:
            # Updated to use 'username'
            user = users.find_one({"username": current_user})
            if user:
                print(f"Found user: {user}")
                return jsonify({"name": f"{user['first_name']} {user['last_name']}"})
            else:
                print("User not found in database")
        else:
            print("No current user")

        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"An exception occurred: {e}")
        return jsonify({"error": "An error occurred"}), 500


@app.route('/api/export_to_excel', methods=['POST'])
def export_to_excel():
    try:
        print("Received Data:", request.json)
        data = request.json

        excel_path = os.getenv('EXCEL_FILE_PATH')
        wb = load_workbook(excel_path)
        ws = wb.active

        for training in data:
            ws.append([training.get(field, "") for field in [
                      "firstName", "lastName", "badgeNumber", "title", "trainer", "date", ""]])

        for column in ws.columns:
            max_length = 0
            column = [cell for cell in column]
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(cell.value)
                except:
                    pass
            adjusted_width = (max_length + 2)
            ws.column_dimensions[column[0].column_letter].width = adjusted_width

        wb.save(excel_path)
        return jsonify({"message": "Training data exported to Excel"}), 200

    except Exception as e:
        traceback.print_exc()
        logging.error(f"An error occurred: {e}")
        return jsonify({"message": "An error occurred while processing your request.", "error": str(e)}), 422


if __name__ == '__main__':
    with app.app_context():
        sql_db.create_all()  # Create all tables for SQLAlchemy
    app.run(debug=True, port=5000)
