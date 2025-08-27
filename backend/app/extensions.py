from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from redis import Redis

db = SQLAlchemy()
migrate = Migrate()
redis_client = None  # global variable

def init_redis(app):
    global redis_client   # ✅ now indented
    redis_client = Redis(
        host=app.config.get("REDIS_HOST", "localhost"),
        port=app.config.get("REDIS_PORT", 6379),
        decode_responses=True
    )
