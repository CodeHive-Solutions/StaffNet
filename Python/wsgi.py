import sys
import os

# Add your Flask app directory to the system path
venv_path = '/var/www/StaffNet/python/venv/lib/python3.10/site-packages'
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)
sys.path.insert(0, '/var/www/StaffNet/Python')

# Import your Flask app object
from handler import app

# Set environment variables
os.environ['FLASK_APP'] = 'app'
os.environ['FLASK_ENV'] = 'production'

# Set the application to be used by mod_wsgi
def application(environ, start_response):
    return app(environ, start_response)
