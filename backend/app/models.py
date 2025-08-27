from datetime import datetime
from .extensions import db


from . import db

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    slug = db.Column(db.String(255))
    content = db.Column(db.Text)
    author = db.Column(db.String(100))
    is_published = db.Column(db.Boolean, default=False)
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    comments = db.relationship(
        "Comment", backref="post", cascade="all, delete-orphan", lazy=True
    )


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(
        db.Integer, db.ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    author = db.Column(db.String(120), nullable=False, default="Guest")
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=0)  # 0–5
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        db.CheckConstraint("rating >= 0 AND rating <= 5", name="ck_comment_rating_range"),
    )
