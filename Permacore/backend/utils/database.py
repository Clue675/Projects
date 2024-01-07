from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)

def create_all():
    """Create all database tables."""
    db.create_all()

def add(instance):
    """Add a new record to the database."""
    db.session.add(instance)

def commit():
    """Commit the current transaction."""
    db.session.commit()

def rollback():
    """Roll back the current transaction."""
    db.session.rollback()

def get_or_404(model, id):
    """Get a record by its ID or return 404."""
    return model.query.get_or_404(id)

def seed_data():
    """Seed the database with initial data."""
    # Add seeding logic here
    pass

# Context manager for database session
from contextlib import contextmanager

@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    try:
        yield db.session
        db.session.commit()
    except:
        db.session.rollback()
        raise
    finally:
        db.session.close()

# Additional database utility functions can be added here
