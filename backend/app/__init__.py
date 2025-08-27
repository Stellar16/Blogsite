from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Database config
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:11231@localhost:5432/blogdb"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    # Import and register blueprints
    from .routes import main_bp
    from .ui import ui_bp
    
    app.register_blueprint(main_bp, url_prefix="/api")  # API under /api
    app.register_blueprint(ui_bp)  # UI routes

    return app
