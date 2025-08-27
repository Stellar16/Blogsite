from flask import Blueprint, request, jsonify, abort
from sqlalchemy import or_, desc
from slugify import slugify
from ..extensions import db, redis_client
from ..models import Post
from ..schemas import PostCreate, PostUpdate
from ..utils.pagination import paginate
from ..cache import cache, POPULAR_POSTS_KEY


bp = Blueprint("posts", __name__, url_prefix="/api/posts")




def post_to_dict(p: Post):
return {
"id": p.id,
"title": p.title,
"slug": p.slug,
"content": p.content,
"author": p.author,
"is_published": p.is_published,
"views": p.views,
"likes": p.likes,
"created_at": p.created_at.isoformat(),
"updated_at": p.updated_at.isoformat(),
}


@bp.get("")
def list_posts():
q = request.args.get("q", type=str)
page = request.args.get("page", default=1, type=int)
page_size = request.args.get("page_size", default=10, type=int)
sort = request.args.get("sort", default="latest", type=str) # latest|popular|likes


query = Post.query.filter_by(is_published=True)
if q:
like = f"%{q}%"
query = query.filter(or_(Post.title.ilike(like), Post.content.ilike(like)))


if sort == "popular":
query = query.order_by(desc(Post.views))
elif sort == "likes":
query = query.order_by(desc(Post.likes))
else:
query = query.order_by(desc(Post.created_at))


data = paginate(query, page, page_size)
data["items"] = [post_to_dict(p) for p in data["items"]]


return jsonify(data)


@bp.get("/popular")
@cache(lambda: POPULAR_POSTS_KEY, ttl=120)
def popular_posts():
posts = Post.query.filter_by(is_published=True).order_by(desc(Post.views)).limit(10).all()
return [post_to_dict(p) for p in posts]


@bp.post("")
def create_post():
try:
payload = PostCreate(**request.json)
except Exception as e:
return jsonify({"error": str(e)}), 400


slug = slugify(payload.title)
if Post.query.filter_by(slug=slug).first():
return jsonify({"error": "Post with similar title already exists"}), 409


post = Post(title=payload.title, slug=slug, content=payload.content, author=payload.author, is_published=payload.is_published)
db.session.add(post)
db.session.commit()
# Invalidate cached popular posts
if redis_client:
redis_client.delete(POPULAR_POSTS_KEY)
return jsonify(post_to_dict(post)), 201


@bp.get("/<int:post_id>")
def get_post(post_id:int):
post = Post.query.get_or_404(post_id)
post.views += 1
db.session.commit()
return jsonify(post_to_dict(post))


@bp.put("/<int:post_id>")
def update_post(post_id:int):
post = Post.query.get_or_404(post_id)
try:
payload = PostUpdate(**request.json)
except Exception as e:
return jsonify({"error": str(e)}), 400


for field, value in payload.model_dump(exclude_none=True).items():
setattr(post, field, value)


db.session.commit()
if redis_client:
redis_client.delete(POPULAR_POSTS_KEY)
return jsonify(post_to_dict(post))


@bp.delete("/<int:post_id>")
def delete_post(post_id:int):
post = Post.query.get_or_404(post_id)
db.session.delete(post)
db.session.commit()
if redis_client:
redis_client.delete(POPULAR_POSTS_KEY)
return "", 204