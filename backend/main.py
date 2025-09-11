# main.py
from flask import Flask
from dotenv import load_dotenv
import os

from src.db import init_db
from src.routes.auth import auth_bp
from src.routes.users import users_bp
from src.api.routes import api_bp  # tu blueprint de forklifts/chargers/batteries

load_dotenv()

def create_app():
    init_db()

    app = Flask(__name__, static_folder="static")
    app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(api_bp)

    @app.get("/health")
    def health():
        return {"ok": True}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5001")), debug=True)
