# api/__init__.py

from .auth import auth_blueprint
from .purchasing import purchasing_blueprint
from .receiving_inspection import receiving_inspection_blueprint
from .supplier_quality import supplier_quality_blueprint
from .vendor import vendor_blueprint
from .shipments import shipment_blueprint
from .discrepancy_api import discrepancy_blueprint
from .vendor_performance_api import vendor_performance_blueprint
from .RunDailySim import run_daily_sim_blueprint

# Other blueprint imports as necessary
