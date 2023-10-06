from flask import Blueprint, request, jsonify
import pandas as pd
from openpyxl import load_workbook
import os

bp = Blueprint('utility', __name__)

# Sample utility function to read from an Excel file
def read_from_excel(file_path):
    df = pd.read_excel(file_path)
    return df.to_dict()

# Sample utility function to write to an Excel file
def write_to_excel(data, file_path):
    df = pd.DataFrame(data)
    df.to_excel(file_path, index=False)

# Sample utility function to update Excel with new training data
def update_excel_with_new_training(training):
    wb = load_workbook(filename=os.getenv('EXCEL_FILE_PATH'))
    ws = wb.active
    new_row = [
        training['firstName'],
        training['lastName'],
        training['badgeNumber'],
        training['title'],
        training['date'],
        training['trainer']
    ]
    ws.append(new_row)
    wb.save(filename=os.getenv('EXCEL_FILE_PATH'))

# Example route to read from Excel
@bp.route('/read-excel', methods=['GET'])
def read_excel():
    file_path = os.getenv('EXCEL_FILE_PATH')
    data = read_from_excel(file_path)
    return jsonify(data)

# Example route to write to Excel
@bp.route('/write-excel', methods=['POST'])
def write_excel():
    data = request.json
    file_path = os.getenv('EXCEL_FILE_PATH')
    write_to_excel(data, file_path)
    return jsonify({"message": "Data written to Excel successfully"})

# Example route to update Excel with new training
@bp.route('/update-excel', methods=['POST'])
def update_excel():
    training = request.json
    update_excel_with_new_training(training)
    return jsonify({"message": "Excel updated with new training data"})
