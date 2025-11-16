"""Main Flask application."""
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from backend.config import Config

# Initialize extensions
db = SQLAlchemy()
cors = CORS()


def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    # CORS configuration - support multiple origins
    cors.init_app(
        app,
        origins=config_class.CORS_ORIGINS,
        supports_credentials=True,
        allow_headers=['Content-Type', 'Authorization']
    )
    
    # Register blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.products import products_bp
    from backend.routes.categories import categories_bp
    from backend.routes.orders import orders_bp
    from backend.routes.messages import messages_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    
    # Health check endpoint
    @app.route('/api/health')
    def health():
        return {'status': 'ok'}, 200
    
    return app

