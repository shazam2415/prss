from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models.base import Base
import os

# Use an environment variable for the database URL, default to a local postgres if not set
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/newsapp")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
