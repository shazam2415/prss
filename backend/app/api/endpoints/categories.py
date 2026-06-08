from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import crud, schemas, database

router = APIRouter()

@router.get("/", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(database.get_db)):
    return crud.get_categories(db)

@router.post("/", response_model=schemas.Category)
def create_category(cat: schemas.CategoryCreate, db: Session = Depends(database.get_db)):
    return crud.create_category(db, cat)
