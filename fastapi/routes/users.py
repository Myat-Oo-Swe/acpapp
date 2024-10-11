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

# from fastapi import APIRouter, Depends, HTTPException, status
# from pydantic import BaseModel
# from typing import Optional, List
# from datetime import datetime, timedelta
# from database import *
# from routes.password_cypher import encrypt
# from jose import JWTError, jwt
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# router = APIRouter()

# # JWT configuration
# SECRET_KEY = "abcde"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# # Pydantic models
# class UserLogin(BaseModel):
#     email: str
#     password_hash: str

# class UserCreate(BaseModel):
#     username: str
#     password_hash: str
#     email: str

# class UserUpdate(BaseModel):
#     username: Optional[str]
#     password_hash: Optional[str]
#     email: Optional[str]

# class User(BaseModel):
#     user_id: int
#     username: str
#     email: str
#     created_at: datetime

# class UserWithBorrowCount(BaseModel):
#     user_id: int
#     username: str
#     email: str
#     total_borrows: Optional[int]

# # Function to create a JWT token
# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# # Function to decode JWT token and verify
# def verify_token(token: str):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id: str = payload.get("sub")
#         if user_id is None:
#             raise credentials_exception
#         return user_id
#     except JWTError:
#         raise credentials_exception

# # Endpoint for login
# @router.post("/token")
# async def login_for_access_token(user: UserLogin):
#     db_user = await get_user_by_email(user.email, encrypt(user.password_hash))
#     if not db_user or db_user.password_hash != encrypt(user.password_hash):
#         raise HTTPException(status_code=400, detail="Incorrect email or password")
    
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(data={"sub": str(db_user.user_id)}, expires_delta=access_token_expires)
#     return {"access_token": access_token, "token_type": "bearer"}

# # Protected route to get current user info
# @router.get("/users/me")
# async def read_users_me(token: str = Depends(oauth2_scheme)):
#     user_id = verify_token(token)
#     user = await get_user(user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"user_id": user.user_id, "username": user.username, "email": user.email}

# # Endpoint to create a new user
# @router.post("/users/create", response_model=User)
# async def create_user(user: UserCreate):
#     hashed_password = encrypt(user.password_hash)
#     result = await insert_user(user.username, hashed_password, user.email)
#     if result is None:
#         raise HTTPException(status_code=400, detail="Error creating user")
#     return result

# # Endpoint to login a user and return a JWT token
# @router.post("/users/login", response_model=Token)
# async def login_user(user: UserLogin):
#     # Fetch user from the database
#     db_user = await get_user_by_email(user.email, encrypt(user.password_hash))

#     if db_user is None or db_user.password_hash != encrypt(user.password_hash):
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     # Generate a JWT token
#     token_data = {"user_id": db_user.user_id, "username": db_user.username}
#     token = create_access_token(token_data)

#     return {
#         "access_token": token,
#         "token_type": "bearer"
#     }


# # Endpoint to get a user by user_id
# @router.get("/users/{user_id}", response_model=User)
# async def read_user(user_id: int):
#     result = await get_user(user_id)
#     if result is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return result

# # Endpoint to update a user
# @router.put("/users/{user_id}", response_model=User)
# async def update_user_endpoint(user_id: int, user: UserUpdate):
#     result = await update_user(user_id, user.username, encrypt(user.password_hash), user.email)
#     if result is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return result

# # Endpoint to delete a user
# @router.delete("/users/{user_id}")
# async def delete_user_endpoint(user_id: int):
#     result = await delete_user(user_id)
#     if result is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"detail": "User deleted"}

# # Endpoint to get all users
# @router.get("/users", response_model=List[User])
# async def get_all_users():
#     result = await get_all_users_from_db()
#     if not result:
#         raise HTTPException(status_code=404, detail="No users found")
#     return result

# # Endpoint to get all users with borrow count
# @router.get("/users_with_borrow_count", response_model=List[UserWithBorrowCount])
# async def get_all_users_with_borrow_count_endpoint():
#     result = await get_all_users_with_borrow_count()
#     return result
