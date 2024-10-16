from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import *

router = APIRouter()

# Pydantic model for borrow creation
class BorrowCreate(BaseModel):
    user_id: int
    book_id: int
    borrow_quantity: int

# Pydantic model for borrow update (to update return_date)
class BorrowUpdate(BaseModel):
    return_date: Optional[datetime]

# Pydantic model for borrow response
# class Borrow(BaseModel):
#     borrow_id: int
#     user_id: int
#     book_id: int
#     borrow_quantity: int
#     borrow_date: datetime
#     return_date: Optional[datetime]

class Borrow(BaseModel):
    borrow_id: int
    user_id: int
    username: str  # New field for user_name
    book_id: int
    book_name: str  # New field for book_name
    borrow_quantity: int
    borrow_date: datetime
    return_date: Optional[datetime]

# Endpoint to create a new borrow (with current timestamp and no return date)
# @router.post("/borrows/create", response_model=Borrow)
# async def create_borrow(borrow: BorrowCreate):
#     result = await insert_borrow(borrow.user_id, borrow.book_id, borrow.borrow_quantity)
#     if result is None:
#         raise HTTPException(status_code=400, detail="Error creating borrow")
#     return result

@router.post("/borrows/create", response_model=BorrowCreate)
async def create_borrow(borrow: BorrowCreate):
    # Check if enough books are available
    book = await get_book(borrow.book_id)
    if book['available_quantity'] >= borrow.borrow_quantity:
        # Create borrow record
        result = await insert_borrow(borrow.user_id, borrow.book_id, borrow.borrow_quantity)
        # Update the available quantity of the book
        await update_book_quantity_on_borrow(borrow.book_id, borrow.borrow_quantity)
        if result is None:
            raise HTTPException(status_code=400, detail="Error creating borrow")
        return result
    else:
        raise HTTPException(status_code=400, detail="Not enough books available")

# Endpoint to get total borrows count
@router.get("/borrows/count")
async def get_total_borrows():
    total_borrows = await get_total_borrows_from_db()
    return {"total_borrows": total_borrows}

# Endpoint to get borrowing counts for each day of the week
@router.get("/borrows/weekly-stats")
async def get_weekly_borrowing_stats():
    try:
        weekly_borrowing = await get_weekly_borrowing_from_db()
        if not weekly_borrowing:
            raise HTTPException(status_code=404, detail="No borrowing data found")

        # Initialize a dictionary to hold borrow counts for each day
        days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        borrowing_stats = {day: 0 for day in days_of_week}

        # Log the fetched data to verify it
        print(f"Weekly borrowing data fetched: {weekly_borrowing}")

        # Iterate over the results and sum borrowings for each day
        for entry in weekly_borrowing:
            borrow_day = entry["day_of_week"].strip()  # Strip to handle spaces
            # Ensure proper casing and mapping
            borrow_day = borrow_day.capitalize()
            if borrow_day in borrowing_stats:
                borrowing_stats[borrow_day] = entry["borrow_count"]

        # Return structured data suitable for chart rendering
        return {
            "series": [{"label": "Books", "data": [borrowing_stats[day] for day in days_of_week]}],
            "xAxis": {"data": days_of_week, "scaleType": "band"}
        }
    except Exception as e:
        print(f"Error fetching weekly borrowing stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/borrows/{borrow_id}", response_model=BorrowUpdate)
async def update_borrow(borrow_id: int, borrow: BorrowUpdate):
    # Update the return date
    result = await update_borrow_return_date(borrow_id, borrow.return_date)
    
    if result is None:
        raise HTTPException(status_code=404, detail="Borrow not found")

    # Increase the available quantity of the book when returned
    if borrow.return_date:
        await update_book_quantity_on_return(result['book_id'], result['borrow_quantity'])
    
    return result



# Endpoint to get a borrow by borrow_id
@router.get("/borrows/{borrow_id}", response_model=Borrow)
async def read_borrow(borrow_id: int):
    result = await get_borrow(borrow_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Borrow not found")
    return result

# Endpoint to delete a borrow by borrow_id
@router.delete("/borrows/{borrow_id}")
async def delete_borrow_endpoint(borrow_id: int):
    result = await delete_borrow(borrow_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Borrow not found")
    return {"detail": "Borrow deleted"}

# Endpoint to get all borrows
@router.get("/borrows", response_model=List[Borrow])
async def get_all_borrows():
    result = await get_all_borrows_from_db()
    if not result:
        raise HTTPException(status_code=404, detail="No borrows found")
    return result

# Endpoint to get all borrows for a specific user
@router.get("/borrows/user/{user_id}", response_model=List[Borrow])
async def get_borrows_by_user(user_id: int):
    result = await get_borrows_by_user_from_db(user_id)  # Add this DB function
    if not result:
        raise HTTPException(status_code=404, detail="No borrows found for this user")
    return result


