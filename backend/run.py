"""Run the Flask application."""
import sys
import os

# Ajouter le répertoire parent au PYTHONPATH pour permettre les imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.config import Config

app = create_app(Config)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

