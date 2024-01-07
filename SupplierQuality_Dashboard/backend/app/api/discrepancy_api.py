# app/api/discrepancy_api.py
from flask import Blueprint, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import logging

from app.models.discrepancy_report import DiscrepancyReport
from app.models.nonconforming_notification import NonconformingNotification  # Import the NonconformingNotification model

# Set up basic configuration for logging
logging.basicConfig(level=logging.INFO)

# Blueprint for discrepancy report functionalities
discrepancy_blueprint = Blueprint('discrepancy', __name__)
CORS(discrepancy_blueprint)

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

@discrepancy_blueprint.route('/discrepancy/reports', methods=['GET'])
def get_reports():
    try:
        logging.info("Fetching all discrepancy reports")
        reports = DiscrepancyReport.get_all_reports()
        return jsonify(reports), 200
    except Exception as e:
        logging.error("Error fetching discrepancy reports: %s", e, exc_info=True)
        return jsonify({'error': str(e)}), 500

@discrepancy_blueprint.route('/discrepancy/notifications/create', methods=['POST'])
def create_notification():
    data = request.get_json()
    report_id = data.get('report_id')
    action = data.get('action')

    if not report_id or not action:
        return jsonify({'error': 'Report ID and action are required'}), 400

    try:
        notification_id = NonconformingNotification.create_notification(report_id, action)
        return jsonify({'message': 'Notification created successfully', 'notification_id': notification_id}), 201
    except Exception as e:
        logging.error("Error creating notification: %s", e, exc_info=True)
        return jsonify({'error': str(e)}), 500

@discrepancy_blueprint.route('/discrepancy/notifications/submit/<int:notification_id>', methods=['POST'])
def submit_notification(notification_id):
    try:
        NonconformingNotification.submit_notification(notification_id)
        return jsonify({'message': 'Notification submitted successfully'}), 200
    except Exception as e:
        logging.error("Error submitting notification: %s", e, exc_info=True)
        return jsonify({'error': str(e)}), 500

@discrepancy_blueprint.route('/discrepancy/notifications', methods=['GET'])
def get_notifications():
    try:
        notifications = NonconformingNotification.get_all_notifications()
        return jsonify(notifications), 200
    except Exception as e:
        logging.error("Error retrieving notifications: %s", e, exc_info=True)
        return jsonify({'error': str(e)}), 500
# You can add more routes and methods as needed

