from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import *
from datetime import datetime

router = APIRouter()

# Pydantic model for book creation
class BookCreate(BaseModel):
    book_name: str
    book_quantity: Optional[int] = 0
    book_description: Optional[str]
    book_pic: Optional[str]

# Pydantic model for book update
class BookUpdate(BaseModel):
    book_name: Optional[str]
    book_quantity: Optional[int]
    book_description: Optional[str]
    book_pic: Optional[str]

# Pydantic model for book response
class Book(BaseModel):
    book_id: int
    book_name: str
    book_quantity: int
    book_description: Optional[str]
    book_pic: Optional[str]
    genre_name: Optional[str]  # Add genre name

# Endpoint to create a new book
@router.post("/books/create", response_model=Book)
async def create_book(book: BookCreate):
    result = await insert_book(book.book_name, book.book_quantity, book.book_description, book.book_pic)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating book")
    return result

# Endpoint to get a book by book_id
@router.get("/books/{book_id}", response_model=Book)
async def read_book(book_id: int):
    result = await get_book(book_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return result

# Endpoint to update a book
@router.put("/books/{book_id}", response_model=Book)
async def update_book(book_id: int, book: BookUpdate):
    result = await update_book(book_id, book.book_name, book.book_quantity, book.book_description, book.book_pic)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return result

# Endpoint to delete a book
@router.delete("/books/{book_id}")
async def delete_book(book_id: int):
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
