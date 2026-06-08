from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import crud, schemas, database, worker

router = APIRouter()

@router.get("/", response_model=List[schemas.Feed])
def read_feeds(db: Session = Depends(database.get_db)):
    return crud.get_feeds(db)

@router.post("/", response_model=schemas.Feed)
def create_feed(f: schemas.FeedCreate, db: Session = Depends(database.get_db)):
    db_feed = crud.create_feed(db, f)
    # Trigger an initial fetch
    worker.fetch_feed_articles(db, db_feed.id)
    return db_feed

@router.post("/{feed_id}/fetch")
def fetch_feed(feed_id: int, db: Session = Depends(database.get_db)):
    worker.fetch_feed_articles(db, feed_id)
    return {"message": "Feed fetched successfully"}

@router.delete("/{feed_id}")
def delete_feed(feed_id: int, db: Session = Depends(database.get_db)):
    db_feed = crud.delete_feed(db, feed_id)
    if db_feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    return {"message": "Feed deleted"}
