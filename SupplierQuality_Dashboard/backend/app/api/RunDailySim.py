import os
import random
from datetime import datetime, timedelta
from flask_cors import cross_origin
import psycopg2

# Assuming these are the correct paths for your model imports
from app.models.purchasing import PurchasingOrder
from app.models.receiving_inspection import ReceivingInspectionRecord
from app.models.discrepancy_report import DiscrepancyReport

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

def get_current_month_bounds():
    today = datetime.now()
    start_of_month = today.replace(day=1)
    return start_of_month, today

def generate_unique_workorder_number(cursor):
    while True:
        workorder_number = 'WO' + str(random.randint(1000, 9999))
        cursor.execute("SELECT * FROM purchasing_orders WHERE workorder_number = %s;", (workorder_number,))
        if not cursor.fetchone():
            return workorder_number

def simulate_purchasing_order(cursor, vendor_id, date):
    try:
        # Generate part number, name, quantity, unit price, revision, material, and status
        part_number = "PN" + str(random.randint(1000, 9999))
        part_name = "Part " + str(random.randint(1, 100))
        quantity = random.randint(1, 100)
        unit_price = round(random.uniform(10, 500), 2)
        revision = random.choice(['A', 'B', 'C'])
        materials = ['Titanium Alloy', 'Durasteel', 'Quantum Crystal', 'Metal', 'Electronics', 'Alloy', 'Textile', 'Organic', 'Composite', 'Mechanical', 'Wood', 'Tech', 'Historic', 'Crystal', 'Military', 'Nuclear', 'Bio-Tech', 'Gas']
        material = random.choice(materials)
        status = "Ordered"  # Assuming all new orders have an initial status of "Ordered"

        # Generate unique workorder number
        workorder_number = 'WO' + str(random.randint(1000, 9999))
        cursor.execute("SELECT EXISTS(SELECT 1 FROM purchasing_orders WHERE workorder_number = %s)", (workorder_number,))
        while cursor.fetchone()[0]:
            workorder_number = 'WO' + str(random.randint(1000, 9999))
            cursor.execute("SELECT EXISTS(SELECT 1 FROM purchasing_orders WHERE workorder_number = %s)", (workorder_number,))

        # Insert new order into database
        cursor.execute("""
            INSERT INTO purchasing_orders (vendor_id, part_number, part_name, quantity, unit_price, revision, material, workorder_number, date_ordered, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING order_id;
        """, (vendor_id, part_number, part_name, quantity, unit_price, revision, material, workorder_number, date, status))

        order_id = cursor.fetchone()[0]
        return order_id

    except Exception as e:
        print(f"Error in simulate_purchasing_order: {e}")
        return None


def simulate_receiving_inspection(cursor, order_id):
    inspection_passed = random.choice([True, False])

    cursor.execute("""
        INSERT INTO receiving_inspections (order_id, inspection_passed)
        VALUES (%s, %s);
    """, (order_id, inspection_passed))

    return inspection_passed

def simulate_discrepancy_report(cursor, order_id):
    cursor.execute("SELECT inspection_passed FROM receiving_inspections WHERE order_id = %s;", (order_id,))
    inspection_result = cursor.fetchone()
    if inspection_result and not inspection_result[0]:
        issue_description = "Issue with order " + str(order_id)
        corrective_action = "Corrective action for order " + str(order_id)

        cursor.execute("""
            INSERT INTO discrepancy_reports (order_id, issue_description, corrective_action)
            VALUES (%s, %s, %s);
        """, (order_id, issue_description, corrective_action))

def run_daily_simulation(conn):
    print("Starting daily simulation...")
    start_of_month, today = get_current_month_bounds()
    vendor_ids = range(2, 22)
    generated_order_ids = set()

    try:
        cursor = conn.cursor()
        for _ in range(20):  # Simulating 20 orders per day
            vendor_id = random.choice(vendor_ids)
            order_id = simulate_purchasing_order(cursor, vendor_id, today)

            while order_id in generated_order_ids:
                order_id = simulate_purchasing_order(cursor, vendor_id, today)
            generated_order_ids.add(order_id)

            if not simulate_receiving_inspection(cursor, order_id):
                simulate_discrepancy_report(cursor, order_id)

        conn.commit()  # Commit the transaction
        cursor.close()
        print("Daily simulation completed.")
    except Exception as e:
        conn.rollback()  # Rollback in case of error
        print(f"Error during simulation: {e}")
    finally:
        if cursor:
            cursor.close()


from flask import Blueprint, jsonify, current_app

run_daily_sim_blueprint = Blueprint('run_daily_sim', __name__)

@run_daily_sim_blueprint.route('/run-simulation', methods=['GET', 'POST'])
@cross_origin()
def run_simulation():
    conn = get_db_connection()
    try:
        run_daily_simulation(conn)
        return jsonify({'message': 'Simulation completed successfully'}), 200
    except Exception as e:
        current_app.logger.error(f"Simulation error: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
