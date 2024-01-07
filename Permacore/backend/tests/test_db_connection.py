import psycopg2
import os
import logging

def create_server_connection():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        logging.error("DATABASE_URL not set in environment variables.")
        raise EnvironmentError("DATABASE_URL not set in environment variables.")

    max_retries = 3
    for attempt in range(max_retries):
        try:
            connection = psycopg2.connect(database_url, connect_timeout=10)  # 10 seconds timeout
            logging.info("PostgreSQL Database connection successful.")
            return connection
        except psycopg2.OperationalError as e:
            logging.warning(f"Database connection attempt {attempt + 1} failed: {e}")
            if attempt + 1 == max_retries:
                logging.error(f"Database connection failed after {max_retries} attempts: {e}")
                raise psycopg2.OperationalError(f"Database connection failed: {e}")
    return None  # This line is optional as the function will exit if an exception is raised

# Ensure that logging is configured in your application
