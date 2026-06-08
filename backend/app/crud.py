from sqlalchemy.orm import Session
from typing import List, Optional
from .models import user, category, feed, article
from . import schemas

# Category CRUD
def get_categories(db: Session):
    return db.query(category.Category).all()

def create_category(db: Session, cat: schemas.CategoryCreate):
    db_category = category.Category(name=cat.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# Feed CRUD
def get_feeds(db: Session):
    return db.query(feed.Feed).all()

def create_feed(db: Session, f: schemas.FeedCreate):
    db_feed = feed.Feed(**f.model_dump())
    db.add(db_feed)
    db.commit()
    db.refresh(db_feed)
    return db_feed

def get_feed(db: Session, feed_id: int):
    return db.query(feed.Feed).filter(feed.Feed.id == feed_id).first()

def delete_feed(db: Session, feed_id: int):
    db_feed = get_feed(db, feed_id)
    if db_feed:
        db.delete(db_feed)
        db.commit()
    return db_feed

# Article CRUD
def get_articles(db: Session, skip: int = 0, limit: int = 100, feed_id: Optional[int] = None):
    query = db.query(article.Article)
    if feed_id:
        query = query.filter(article.Article.feed_id == feed_id)
    return query.order_by(article.Article.published_at.desc()).offset(skip).limit(limit).all()

def update_article_read_state(db: Session, article_id: int, is_read: bool):
    db_article = db.query(article.Article).filter(article.Article.id == article_id).first()
    if db_article:
        db_article.is_read = is_read
        db.commit()
        db.refresh(db_article)
    return db_article
