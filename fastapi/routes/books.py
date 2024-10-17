from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import *
from datetime import datetime

router = APIRouter()

# Pydantic model for book creation
class BookCreate(BaseModel):
    book_name: str
    book_quantity: Optional[int] 
    book_description: Optional[str]
    book_pic: Optional[str]
    genre_id: Optional[int]  # New field for genre

# Pydantic model for book update
class BookUpdate(BaseModel):
    book_name: str
    book_quantity: Optional[int]
    available_quantity: Optional[int]
    book_description: Optional[str]
    book_pic: Optional[str]
    genre_id: Optional[int]  # New field for genre

# Pydantic model for book response
class Book(BaseModel):
    book_id: int
    book_name: str
    book_quantity: Optional[int]
    available_quantity: Optional[int]
    book_description: Optional[str]
    book_pic: Optional[str]
    genre_id: Optional[int]  # New field for genre
    genre_name: Optional[str]  # To display the genre name

# Endpoint to create a new book
@router.post("/books/create", response_model=BookCreate)
async def create_book(book: BookCreate):
    result = await insert_book(book.book_name, book.book_quantity, book.book_description, book.book_pic, book.genre_id)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating book")
    return result

# Endpoint to get total unique books count
@router.get("/books/unique_count")
async def get_total_unique_books():
    total_unique_books = await get_total_unique_books_from_db()
    if total_unique_books is None:
        raise HTTPException(status_code=404, detail="No books found")
    return {"total_unique_books": total_unique_books}

# Endpoint to get total books count
@router.get("/books/total-count")
async def get_total_books():
    total_books = await get_total_books_from_db()
    if total_books is None:
        raise HTTPException(status_code=404, detail="No books found")
    return {"total_books": total_books}

# Endpoint to get available books count
@router.get("/books/available-count")
async def get_available_books():
    available_books = await get_available_books_from_db()
    if available_books is None:
        raise HTTPException(status_code=404, detail="No available books found")
    return {"available_books": available_books}

# Endpoint to get a book by book_id
@router.get("/books/{book_id}", response_model=Book)
async def read_book(book_id: int):
    result = await get_book(book_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return result

# Endpoint to update a book
@router.put("/books/{book_id}", response_model=BookUpdate)
async def update_book_endpoint(book_id: int, book: BookUpdate):
    result = await update_book(book_id, book.book_name, book.book_quantity,book.available_quantity, book.book_description, book.book_pic, book.genre_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return result

# Endpoint to delete a book
@router.delete("/books/{book_id}")
async def delete_book_endpoint(book_id: int):
    result = await delete_book(book_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"detail": "Book deleted"}


# Endpoint to get all books
@router.get("/books", response_model=List[Book])
async def get_all_books():
    result = await get_all_books_from_db()
    if not result:
        raise HTTPException(status_code=404, detail="No books found")
    return result

@router.get("/books/genres/count")
async def get_books_by_genre_count():
    result = await get_books_by_genre_count_from_db()
    if not result:
        raise HTTPException(status_code=404, detail="No books found by genre count")
    return result


# books.py

# Endpoint to get total books count
@router.get("/books/count", name="get_total_books")
async def get_total_books():
    query = "SELECT COUNT(*) FROM books"
    total_books = await database.fetch_one(query)
    return {"total_books": total_books[0]}

# Endpoint to get available books count
@router.get("/books/available-count", name="get_available_books")
async def get_available_books():
    query = "SELECT SUM(available_quantity) FROM books"
    available_books = await database.fetch_one(query)
    return {"available_books": available_books[0]}


