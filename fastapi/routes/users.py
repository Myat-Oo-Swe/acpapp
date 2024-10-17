from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *
from typing import List, Optional
from routes.password_cypher import encrypt, decrypt


router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password_hash: str

# Pydantic model for user creation
class UserCreate(BaseModel):
    username: str
    password_hash: str
    email: str

# Pydantic model for user update
class UserUpdate(BaseModel):
    username: Optional[str]
    password_hash: Optional[str]
    email: Optional[str]

# Pydantic model for user response
class User(BaseModel):
    user_id: int
    username: str
    password_hash: str
    email: str
    created_at: datetime
    
class UserWithBorrowCount(BaseModel):
    user_id: int
    username: str
    email: str
    total_borrows: Optional[int]
    


# Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    # hashed_password = encrypt(user.password_hash)
    result = await insert_user(user.username, encrypt(user.password_hash), user.email)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    return result

# Endpoint to get total members count
@router.get("/users/count")
async def get_total_members():
    total_members = await get_total_members_from_db()
    return {"total_members": total_members}

# Endpoint to get a user by user_id
@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int):
    result = await get_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to update a user
@router.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):
    result = await update_user(user_id, user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to delete a user
@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int):
    result = await delete_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# Endpoint for user login
@router.post("/users/login")
async def login_user(user: UserLogin):
    # Fetch user from the database
    db_user = await get_user_by_email(user.email, encrypt(user.password_hash))

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Compare the stored hashed password with the provided password
    if db_user.password_hash != encrypt(user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    # If login is successful, you can return user info (omit password hash)
    return {
        "user_id": db_user.user_id,
        "username": db_user.username,
        "email": db_user.email,
        "created_at": db_user.created_at,
    }

# Endpoint to get all users
@router.get("/users", response_model=List[User])
async def get_all_users():
    result = await get_all_users_from_db()  # A function you should add to interact with the database
    if not result:
        raise HTTPException(status_code=404, detail="No users found")
    return result

# Endpoint to get all users with borrowcount
@router.get("/users_with_borrow_count", response_model=List[UserWithBorrowCount])
async def get_all_users_with_borrow_count_endpoint():
    result = await get_all_users_with_borrow_count()
    return result

