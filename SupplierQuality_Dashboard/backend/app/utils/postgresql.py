import psycopg2
from psycopg2 import OperationalError
import os
import logging

def create_server_connection():
    connection = None
    try:
        database_url = os.getenv('DATABASE_URL')
        connection = psycopg2.connect(database_url)
        logging.info("PostgreSQL Database connection successful")
    except OperationalError as e:
        logging.error(f"The error '{e}' occurred")
        # Consider raising an exception or retrying the connection
        raise OperationalError(f"Database connection failed: {e}")
    return connection
