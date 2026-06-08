from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ... import crud, schemas, database

router = APIRouter()

@router.get("/", response_model=List[schemas.Article])
def read_articles(
    feed_id: Optional[int] = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db)
):
    return crud.get_articles(db, skip=skip, limit=limit, feed_id=feed_id)

@router.patch("/{article_id}/read", response_model=schemas.Article)
def toggle_article_read(article_id: int, is_read: bool, db: Session = Depends(database.get_db)):
    db_article = crud.update_article_read_state(db, article_id, is_read)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article
