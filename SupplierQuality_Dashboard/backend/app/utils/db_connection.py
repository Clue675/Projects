import os
import logging
import psycopg2
from urllib.parse import urlparse

def create_server_connection():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        logging.error("DATABASE_URL not set in environment variables.")
        return None

    # Parse the database URL
    result = urlparse(database_url)
    username, password, database = result.username, result.password, result.path[1:]
    hostname, port = result.hostname, result.port

    # Define the connection parameters
    connection_params = {
        "dbname": database,
        "user": username,
        "password": password,
        "host": hostname,
        "port": port,
        "connect_timeout": 10  # 10 seconds timeout
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            connection = psycopg2.connect(**connection_params)
            logging.info("Database connection successful.")
            return connection
        except psycopg2.OperationalError as e:
            logging.warning(f"Database connection attempt {attempt + 1} failed: {e}")
            if attempt + 1 == max_retries:
                logging.error(f"Database connection failed after {max_retries} attempts.")
                raise

    return None  # Return None if the connection could not be established

# Ensure that proper logging configuration is set elsewhere in the application
# For instance, in the main app file or a separate configuration module
logging.basicConfig(level=logging.INFO)
