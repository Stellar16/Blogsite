from .extensions import redis_client
from functools import wraps
import json


def cache(key_builder, ttl=60):
def decorator(f):
@wraps(f)
def wrapper(*args, **kwargs):
if not redis_client:
return f(*args, **kwargs)
key = key_builder(*args, **kwargs)
cached = redis_client.get(key)
if cached:
return json.loads(cached)
result = f(*args, **kwargs)
redis_client.setex(key, ttl, json.dumps(result))
return result
return wrapper
return decorator


# Helper keys
POPULAR_POSTS_KEY = "popular_posts"
RECENT_COMMENTS_KEY = "recent_comments"