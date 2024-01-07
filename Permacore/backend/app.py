from flask import Flask
from backend.app import create_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from dotenv import load_dotenv
from backend.utils.database import db

# Load environment variables
load_dotenv()

# Instantiate the db SQLAlchemy object
db = SQLAlchemy()

def create_app():
    """
    Create and configure the Flask application.
    This function initializes the Flask app, sets up configurations,
    initializes extensions like SQLAlchemy, and registers blueprints.
    """

    # Initialize the Flask app
    app = Flask(__name__)

    # Load configurations from 'config.py'
    # Make sure 'backend.config.DevelopmentConfig' is the correct path to your config
    app.config.from_object('backend.config.DevelopmentConfig')

    # Initialize SQLAlchemy with the Flask App
    db.init_app(app)

    # Initialize Flask-Migrate for database migrations
    Migrate(app, db)

    # Enable Cross-Origin Resource Sharing (CORS) for all routes
    CORS(app)
    
    # Model Imports
    from backend.models.vendor import Vendor
    from backend.models.certification import Certification
    from backend.models.shipment import Shipment
    from backend.models.inspection import Inspection
    from backend.models.supplier_quality import SupplierQuality
    from backend.models.rejection_code import RejectionCode


    # Import and register blueprints for different routes
    # Ensure these blueprints are created in the respective 'routes' files
    from backend.routes.vendor_routes import vendor_bp
    from backend.routes.shipment_routes import shipment_bp
    from backend.routes.inspection_routes import inspection_bp

    # Update url_prefix as needed
    app.register_blueprint(vendor_bp, url_prefix='/vendors/')
    app.register_blueprint(shipment_bp, url_prefix='/shipments/')
    app.register_blueprint(inspection_bp, url_prefix='/inspections/')
    
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db, 
            'Vendor': Vendor,
            # Add other models or objects as needed
        }
    

    return app

# Run the app
if __name__ == '__main__':
    # Create the Flask application
    app = create_app()

    # Run the Flask app
    # You can set the host and port as needed, for example, app.run(host='0.0.0.0', port=5000)
    app.app_context().push()
