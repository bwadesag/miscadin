#!/bin/bash
# Script to run the Flask application

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
while ! nc -z ${DB_HOST:-localhost} ${DB_PORT:-3306}; do
  sleep 1
done

echo "MySQL is ready!"

# Initialize database
echo "Initializing database..."
python -m backend.init_db

# Run Flask application
echo "Starting Flask application..."
python -m flask run --host=0.0.0.0 --port=5000



