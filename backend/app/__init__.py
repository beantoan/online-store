from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from .config import Config

db = SQLAlchemy()
migrate = Migrate()


def register_blueprints(app):
    from .routes.auth import auth
    from .routes.products import products
    from .routes.orders import orders

    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(products)
    app.register_blueprint(orders)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    if app.config.get('CORS_ENABLED'):
        CORS(app, expose_headers=["Location"])

    db.init_app(app)
    migrate.init_app(app, db)

    register_blueprints(app)

    # Import and register CLI commands
    from .cli import generate_products
    app.cli.add_command(generate_products)

    return app
