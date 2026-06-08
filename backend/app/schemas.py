from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

# Feed Schemas
class FeedBase(BaseModel):
    title: str
    url: str
    category_id: Optional[int] = None

class FeedCreate(FeedBase):
    pass

class Feed(FeedBase):
    id: int
    last_fetched_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Article Schemas
class ArticleBase(BaseModel):
    title: str
    link: str
    description: Optional[str] = None
    author: Optional[str] = None
    published_at: Optional[datetime] = None

class Article(ArticleBase):
    id: int
    feed_id: int
    is_read: bool
    is_favorite: bool
    content: Optional[str] = None

    class Config:
        from_attributes = True
