from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.api import api_router
from .database import engine, SessionLocal
from .models.base import Base
from .models.user import User
from . import worker, crud, auth
from apscheduler.schedulers.background import BackgroundScheduler
import os

# Create tables
Base.metadata.create_all(bind=engine)

def create_initial_user():
    db = SessionLocal()
    try:
        username = os.getenv("APP_USERNAME", "admin")
        password = os.getenv("APP_PASSWORD", "admin")
        
        existing_user = db.query(User).filter(User.username == username).first()
        if not existing_user:
            hashed_pw = auth.get_password_hash(password)
            db_user = User(username=username, hashed_password=hashed_pw)
            db.add(db_user)
            db.commit()
    finally:
        db.close()

def refresh_all_feeds():
    db = SessionLocal()
    try:
        feeds = crud.get_feeds(db)
        for f in feeds:
            worker.fetch_feed_articles(db, f.id)
    finally:
        db.close()

app = FastAPI(title="Personal RSS Reader")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    create_initial_user()
    scheduler = BackgroundScheduler()
    scheduler.add_job(refresh_all_feeds, 'interval', minutes=30)
    scheduler.start()

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to your Personal RSS Reader API"}
