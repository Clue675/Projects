import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///default.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Add other configuration variables

class DevelopmentConfig:
    """
    Development configurations
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Other development configurations...

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    # Additional testing-specific configurations

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    # Additional production-specific configurations
