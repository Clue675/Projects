from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Instantiate the db SQLAlchemy object
db = SQLAlchemy()

def create_app():
    """
    Create and configure the Flask application.
    """
    app = Flask(__name__)

    # Load configurations from environment variables or configuration file
    app.config.from_object('config.DevelopmentConfig')

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    # Register blueprints
    from backend.routes.vendor_routes import vendor_bp
    from backend.routes.shipment_routes import shipment_bp
    from backend.routes.inspection_routes import inspection_bp

    app.register_blueprint(vendor_bp, url_prefix='/api/vendors')
    app.register_blueprint(shipment_bp, url_prefix='/api/shipments')
    app.register_blueprint(inspection_bp, url_prefix='/api/inspections')

    return app

# Run the app if this file is executed directly
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
