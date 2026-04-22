from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    from app.routes import api
    app.register_blueprint(api)
    
    with app.app_context():
        db.create_all()
    
    return app