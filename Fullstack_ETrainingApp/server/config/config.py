import os

class Config:
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

class DevelopmentConfig(Config):
    DEBUG = True

config = {
    'development': DevelopmentConfig,
    'default': Config
}

def load_config(app):
    # Determine the current environment (e.g., 'development' or 'default')
    environment = os.environ.get('FLASK_ENV', 'default')
    
    # Load the configuration based on the current environment
    app.config.from_object(config[environment])
