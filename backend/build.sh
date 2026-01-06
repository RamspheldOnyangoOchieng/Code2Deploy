#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create logs directory
mkdir -p logs

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Reset/create admin user (uses environment variables if set, otherwise defaults)
python manage.py reset_admin --email "${ADMIN_EMAIL:-admin@code2deploy.com}" --password "${ADMIN_PASSWORD:-Admin@123!}" --username "${ADMIN_USERNAME:-admin}"
