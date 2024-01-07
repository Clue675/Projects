import os
import sys
from flask import current_app
from alembic import context
from sqlalchemy import engine_from_config, pool

# Add the path of your application to the system path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import your Flask app and database instance here
# Replace 'app' with the correct import according to your app structure
from app import app, db

# Alembic configuration
config = context.config

# Ensure the Flask app context is active
with app.app_context():
    # Set the SQLALCHEMY_DATABASE_URI for Alembic
    config.set_main_option('sqlalchemy.url', str(db.engine.url))

    # Add your model's MetaData object here for 'autogenerate' support
    target_metadata = db.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
