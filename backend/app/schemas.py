from pydantic import BaseModel, Field
from typing import Optional


class PostCreate(BaseModel):
title: str = Field(min_length=1, max_length=255)
content: str
author: str = Field(default="Anonymous", max_length=120)
is_published: bool = True


class PostUpdate(BaseModel):
title: Optional[str] = Field(default=None, min_length=1, max_length=255)
content: Optional[str] = None
author: Optional[str] = Field(default=None, max_length=120)
is_published: Optional[bool] = None


class CommentCreate(BaseModel):
author: str = Field(default="Guest", max_length=120)
content: str
rating: int = Field(default=0, ge=0, le=5)


class CommentUpdate(BaseModel):
author: Optional[str] = Field(default=None, max_length=120)
content: Optional[str] = None
rating: Optional[int] = Field(default=None, ge=0, le=5)