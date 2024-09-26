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

class BookInGenre(BaseModel):
    book_id: Optional[int]
    book_name: Optional[str]

class GenreWithBooks(BaseModel):
    genre_id: int
    genre_name: str
    genre_description: Optional[str]
    books: List[BookInGenre]  # Remove Optional from List




# Endpoint to get all genres
@router.get("/genres", response_model=List[Genre])
async def get_all_genres():
    result = await get_all_genres_from_db()
    if not result:
        raise HTTPException(status_code=404, detail="No genres found")
    return result

from pydantic import ValidationError
import logging

# Add a logger
logger = logging.getLogger("uvicorn.error")

@router.get("/genres-with-books", response_model=List[GenreWithBooks])
async def get_genres_with_books():
    try:
        # Fetch genres and their respective books
        genres_query = "SELECT genre_id, genre_name, genre_description FROM genre"
        genres = await database.fetch_all(genres_query)

        books_query = "SELECT book_id, book_name, genre_id FROM books"
        books = await database.fetch_all(books_query)

        # Create a mapping of genres to books, ensuring 'books' is always initialized
        genre_dict = {genre['genre_id']: {
            'genre_id': genre['genre_id'],
            'genre_name': genre['genre_name'],
            'genre_description': genre['genre_description'],
            'books': []  # Initialize books as an empty list
        } for genre in genres}

        # Append books to the respective genre's 'books' list
        for book in books:
            genre_id = book['genre_id']
            if genre_id in genre_dict:
                genre_dict[genre_id]['books'].append({
                    'book_id': book['book_id'],
                    'book_name': book['book_name']
                })

        # Convert the genre dictionary to a list for the response
        validated_result = [GenreWithBooks(**genre) for genre in genre_dict.values()]
        
        
    except ValidationError as e:
        logger.error(f"Validation Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Validation error: {e}")
    except Exception as e:
        logger.error(f"Error fetching genres with books: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
    return validated_result
