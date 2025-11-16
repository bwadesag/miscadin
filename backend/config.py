"""Configuration module - reads from environment variables."""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration."""
    
    # Database Configuration
    # Utilise SQLite par défaut (plus simple, pas besoin de serveur)
    # Pour utiliser MySQL, définissez USE_MYSQL=true dans .env
    USE_MYSQL = os.getenv('USE_MYSQL', 'false').lower() == 'true'
    
    if USE_MYSQL:
        # Configuration MySQL
        DB_HOST = os.getenv('DB_HOST', 'localhost')
        DB_PORT = int(os.getenv('DB_PORT', 3306))
        DB_USER = os.getenv('DB_USER', 'root')
        DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')
        DB_NAME = os.getenv('DB_NAME', 'miscadin')
        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )
    else:
        # Configuration SQLite (par défaut)
        DB_PATH = os.getenv('DB_PATH', 'instance/miscadin.db')
        # Créer le dossier instance s'il n'existe pas (chemin absolu)
        db_dir = os.path.dirname(DB_PATH)
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)
        # Utiliser un chemin absolu pour SQLite
        abs_db_path = os.path.abspath(DB_PATH)
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{abs_db_path}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv('SQLALCHEMY_ECHO', 'False').lower() == 'true'
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    
    # CORS - Supporte les ports 5173 et 5174 (Vite peut changer de port)
    default_origins = 'http://localhost:5173,http://localhost:5174'
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', default_origins).split(',')

