from flask import Flask

# Import blueprints
from .api.auth import auth_blueprint
from .api.purchasing import purchasing_blueprint
from .api.receiving_inspection import receiving_inspection_blueprint
from .api.supplier_quality import supplier_quality_blueprint
from .api.vendor import vendor_blueprint
from .api.shipments import shipment_blueprint

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(purchasing_blueprint, url_prefix='/purchasing')
    app.register_blueprint(receiving_inspection_blueprint, url_prefix='/receiving_inspection')
    app.register_blueprint(supplier_quality_blueprint, url_prefix='/supplier_quality')
    app.register_blueprint(vendor_blueprint, url_prefix='/vendor')
    app.register_blueprint(shipment_blueprint, url_prefix='/shipments')

    # Additional app configurations go here

    return app
