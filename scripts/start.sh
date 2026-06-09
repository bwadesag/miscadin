#!/usr/bin/env bash
set -e

echo "Initialisation de la base de données (non bloquante)..."
python -m backend.init_db || echo "ATTENTION: init_db a echoue, le serveur demarre quand meme."

echo "Routes enregistrees :"
python -c "from wsgi import application; print([str(r) for r in application.url_map.iter_rules()])"

echo "Demarrage du serveur sur le port ${PORT:-5000}..."
exec gunicorn --bind "0.0.0.0:${PORT:-5000}" --workers 1 --threads 2 --timeout 120 wsgi:application
