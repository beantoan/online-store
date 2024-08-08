#!/bin/sh

set -e

# Wait for the database
./wait-for.sh db:5432 --timeout=30 -- echo "Database is up"

# Initialize migrations if the directory doesn't exist
if [ ! -d "migrations" ]; then
    echo "Initializing migrations directory..."
    flask db init
    echo "Migrations directory initialized."
fi

# Check if there are any migrations to apply
if flask db current | grep -q "head"; then
    echo "No migrations to apply."
else
    echo "Applying database migrations..."
    flask db migrate -m "Auto-generated migration"
    flask db upgrade
    echo "Migrations applied."
fi

# Start the Flask application
echo "Starting Flask application..."
exec flask run --host=0.0.0.0