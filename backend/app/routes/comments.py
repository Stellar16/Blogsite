from flask import Blueprint, request, jsonify
from sqlalchemy import desc
from ..extensions import db, redis_client
from ..models import Comment, Post
from ..schemas import CommentCreate, CommentUpdate


bp = Blueprint("comments", __name__, url_prefix="/api")




def comment_to_dict(c: Comment):
return {
"id": c.id,
"post_id": c.post_id,
"author": c.author,
"content": c.content,
"rating": c.rating,
"created_at": c.created_at.isoformat(),
"updated_at": c.updated_at.isoformat(),
}


@bp.get("/posts/<int:post_id>/comments")
def list_comments(post_id:int):
Post.query.get_or_404(post_id)
comments = Comment.query.filter_by(post_id=post_id).order_by(desc(Comment.created_at)).all()
return jsonify([comment_to_dict(c) for c in comments])


@bp.post("/posts/<int:post_id>/comments")
def add_com