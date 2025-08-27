from flask import Blueprint, request, jsonify
from .extensions import db
from .models import Post, Comment

main_bp = Blueprint("main", __name__)

# ---------- ROOT ----------
@main_bp.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "Welcome to the Blog API",
        "routes": {
            "list_posts": "/posts",
            "create_post": "/posts [POST]",
            "get_post": "/posts/<id>",
            "update_post": "/posts/<id> [PUT]",
            "delete_post": "/posts/<id> [DELETE]",
            "list_comments": "/posts/<post_id>/comments",
            "create_comment": "/posts/<post_id>/comments [POST]",
            "delete_comment": "/comments/<id> [DELETE]"
        }
    })


# ---------- POSTS ----------
@main_bp.route("/posts", methods=["GET"])
def get_posts():
    search_query = request.args.get("q", "")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    query = Post.query

    # Apply search filter if query exists
    if search_query:
        query = query.filter(
            (Post.title.ilike(f"%{search_query}%")) |
            (Post.content.ilike(f"%{search_query}%"))
        )

    paginated_posts = query.order_by(Post.created_at.desc()).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    results = [
        {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "content": p.content,
            "author": p.author,
            "is_published": p.is_published,
            "views": p.views,
            "likes": p.likes,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
        } for p in paginated_posts.items
    ]

    return jsonify({
        "page": page,
        "per_page": per_page,
        "total": paginated_posts.total,
        "pages": paginated_posts.pages,
        "posts": results
    })


@main_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.json
    post = Post(
        title=data["title"],
        slug=data["slug"],
        content=data["content"],
        author=data.get("author", "Anonymous"),
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({"message": "Post created", "id": post.id}), 201


@main_bp.route("/posts/<int:id>", methods=["GET"])
def get_post(id):
    post = Post.query.get_or_404(id)
    return jsonify({
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "content": post.content,
        "author": post.author,
        "is_published": post.is_published,
        "views": post.views,
        "likes": post.likes,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    })


@main_bp.route("/posts/<int:id>", methods=["PUT"])
def update_post(id):
    post = Post.query.get_or_404(id)
    data = request.json
    post.title = data.get("title", post.title)
    post.slug = data.get("slug", post.slug)
    post.content = data.get("content", post.content)
    post.author = data.get("author", post.author)
    post.is_published = data.get("is_published", post.is_published)
    db.session.commit()
    return jsonify({"message": "Post updated"})


@main_bp.route("/posts/<int:id>", methods=["DELETE"])
def delete_post(id):
    post = Post.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"})


# ---------- COMMENTS ----------
@main_bp.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).all()
    return jsonify([
        {
            "id": c.id,
            "author": c.author,
            "content": c.content,
            "rating": c.rating,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
        } for c in comments
    ])


@main_bp.route("/posts/<int:post_id>/comments", methods=["POST"])
def create_comment(post_id):
    data = request.json
    comment = Comment(
        post_id=post_id,
        author=data.get("author", "Guest"),
        content=data["content"],
        rating=data.get("rating", 0),
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comment added", "id": comment.id}), 201


@main_bp.route("/comments/<int:id>", methods=["DELETE"])
def delete_comment(id):
    comment = Comment.query.get_or_404(id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted"})
