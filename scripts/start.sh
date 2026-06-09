#!/usr/bin/env bash
set -e

echo "Initialisation de la base de données..."
python -m backend.init_db

echo "Routes enregistrées :"
python -c "from wsgi import application; print([str(r) for r in application.url_map.iter_rules()])"

echo "Démarrage du serveur sur le port ${PORT:-5000}..."
exec gunicorn --bind "0.0.0.0:${PORT:-5000}" --workers 1 --timeout 120 wsgi:application
