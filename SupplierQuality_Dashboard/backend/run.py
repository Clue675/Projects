from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Initialize Flask App
app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()
secret_key = os.getenv('JWT_SECRET_KEY')
logging.basicConfig(level=logging.DEBUG)


# Configuration Classes
class Config:
    """Base configuration."""
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False




# Function to create database tables
def create_tables():
    # Connect to the database using DATABASE_URL
    with psycopg2.connect(Config.DATABASE_URL, cursor_factory=RealDictCursor) as conn:
        with conn.cursor() as cursor:
            # Users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    first_name VARCHAR(255),
                    last_name VARCHAR(255),
                    department VARCHAR(255),
                    phone_number VARCHAR(20),
                    alt_phone_number VARCHAR(20)
                );
            """)

            # Vendors table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vendors (
                    vendor_id SERIAL PRIMARY KEY,
                    vendor_name VARCHAR(255) NOT NULL,
                    contact_info TEXT,
                    performance_score FLOAT,
                    status VARCHAR(50) NOT NULL,
                    last_audit_date DATE,
                    next_audit_date DATE,
                    comments TEXT
                );
            """)

            # Receiving inspection records table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS receiving_inspection_records (
                    inspection_id SERIAL PRIMARY KEY,
                    order_id INTEGER REFERENCES purchasing_orders(order_id),
                    inspection_date DATE,
                    inspector_name VARCHAR(255),
                    total_parts_received INTEGER,
                    total_parts_accepted INTEGER,
                    total_parts_rejected INTEGER,
                    notes TEXT,
                    rejection_details JSONB,
                    discrepancy_report_id VARCHAR(255)
                );
            """)

            # Supplier quality records table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS supplier_quality_records (
                    record_id SERIAL PRIMARY KEY,
                    vendor_id INTEGER REFERENCES vendors(vendor_id),
                    quality_score FLOAT CHECK (quality_score BETWEEN 0 AND 100),
                    record_date DATE,
                    notes TEXT
                );
            """)

            # Vendor certificates table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vendor_certificates (
                    id SERIAL PRIMARY KEY,
                    vendor_id INTEGER REFERENCES vendors(vendor_id),
                    certificate_name VARCHAR(255),
                    certificate_text TEXT,
                    issued_date DATE,
                    issued_by VARCHAR(255),
                    expiration_date DATE,
                    notes TEXT
                );
            """)

            # Shipments table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS shipments (
                    shipment_id SERIAL PRIMARY KEY,
                     line_item INTEGER,
                    order_id INTEGER REFERENCES purchasing_orders(order_id),
                     vendor_name VARCHAR(255),
                     workorder_number VARCHAR(255),
                     rework_number VARCHAR(255),
                    part_number VARCHAR(255),
                    qty_received INTEGER,
                    unit_cost DECIMAL,
                     date_received DATE,
                    comments TEXT,
                    expected_delivery_date DATE,
                    actual_delivery_date DATE,
                    status VARCHAR(50),
                    notes TEXT
                );
            """)

            conn.commit()


# Create Flask app with specified configuration
def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    jwt = JWTManager(app)  # Initialize JWT Manager
    
    # Create database tables
    create_tables()

   # Import blueprints
    from app.api.auth import auth_blueprint
    from app.api.receiving_inspection import receiving_inspection_blueprint
    from app.api.supplier_quality import supplier_quality_blueprint
    from app.api.vendor import vendor_blueprint
    from app.api.shipments import shipment_blueprint
    from app.api.discrepancy_api import discrepancy_blueprint
    from app.api.vendor_performance_api import vendor_performance_blueprint
    from app.api.RunDailySim import run_daily_sim_blueprint

    # Register blueprints with appropriate URL prefixes
    app.register_blueprint(auth_blueprint, url_prefix='/api/')
    app.register_blueprint(receiving_inspection_blueprint, url_prefix='/api/receiving_inspection')
    app.register_blueprint(supplier_quality_blueprint, url_prefix='/api/supplier_quality')
    app.register_blueprint(vendor_blueprint, url_prefix='/api/vendor')
    app.register_blueprint(shipment_blueprint, url_prefix='/api/shipments')
    app.register_blueprint(discrepancy_blueprint, url_prefix='/api/discrepancy')
    app.register_blueprint(vendor_performance_blueprint, url_prefix='/api/vendor_performance')
    app.register_blueprint(run_daily_sim_blueprint, url_prefix='/api/run_daily_sim')

    return app



# Run the application
if __name__ == '__main__':
    env_config = os.getenv('FLASK_ENV', 'development')
    app_config = DevelopmentConfig if env_config == 'development' else ProductionConfig
    CORS(app)
    app = create_app(app_config)
    app.run()