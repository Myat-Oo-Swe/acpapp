from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import *

router = APIRouter()

# Pydantic model for genre response
class Genre(BaseModel):
    genre_id: int
    genre_name: str
    genre_description: str

# Endpoint to get all genres
@router.get("/genres", response_model=List[Genre])
async def get_all_genres():
    result = await get_all_genres_from_db()
    if not result:
        raise HTTPException(status_code=404, detail="No genres found")
    return result
