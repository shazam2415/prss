from fastapi import APIRouter, Depends
from .endpoints import categories, feeds, articles, auth
from ..auth import get_current_user

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"], dependencies=[Depends(get_current_user)])
api_router.include_router(feeds.router, prefix="/feeds", tags=["feeds"], dependencies=[Depends(get_current_user)])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"], dependencies=[Depends(get_current_user)])
