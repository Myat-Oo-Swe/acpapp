from databases import Database
from typing import Optional

# Configuration for Database connection
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

# Database instance
database = Database(DATABASE_URL)

# Database Connection Functions
async def connect_db():
    await database.connect()
    print("Database connected")

async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")


# -------------------- USER OPERATIONS --------------------

# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES (:username, :password_hash, :email)
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to select a user by user_id from the users table
async def get_user(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to select a user by email from the users table
async def get_user_by_email(email: str, password_hash: str):
    query = "SELECT * FROM users WHERE email = :email and password_hash = :password_hash"
    return await database.fetch_one(query=query, values={"email": email, "password_hash": password_hash})

# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
    query = """
    UPDATE users 
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to delete a user from the users table
async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to get all users from the users table
async def get_all_users_from_db():
    query = "SELECT * FROM users"
    return await database.fetch_all(query)


# -------------------- BOOK OPERATIONS --------------------

# Function to insert a new book into the books table
async def insert_book(book_name: str, book_quantity: int, book_description: Optional[str], book_pic: Optional[str]):
    query = """
    INSERT INTO books (book_name, book_quantity, book_description, book_pic)
    VALUES (:book_name, :book_quantity, :book_description, :book_pic)
    RETURNING book_id, book_name, book_quantity, book_description, book_pic
    """
    values = {
        "book_name": book_name,
        "book_quantity": book_quantity,
        "book_description": book_description,
        "book_pic": book_pic
    }
    return await database.fetch_one(query=query, values=values)

# Function to select a book by book_id from the books table
async def get_book(book_id: int):
    query = "SELECT * FROM books WHERE book_id = :book_id"
    return await database.fetch_one(query=query, values={"book_id": book_id})

# Function to update a book in the books table
async def update_book(book_id: int, book_name: Optional[str], book_quantity: Optional[int], book_description: Optional[str], book_pic: Optional[str]):
    query = """
    UPDATE books
    SET book_name = COALESCE(:book_name, book_name), 
        book_quantity = COALESCE(:book_quantity, book_quantity), 
        book_description = COALESCE(:book_description, book_description), 
        book_pic = COALESCE(:book_pic, book_pic)
    WHERE book_id = :book_id
    RETURNING book_id, book_name, book_quantity, book_description, book_pic
    """
    values = {
        "book_id": book_id,
        "book_name": book_name,
        "book_quantity": book_quantity,
        "book_description": book_description,
        "book_pic": book_pic
    }
    return await database.fetch_one(query=query, values=values)

# Function to delete a book from the books table
async def delete_book(book_id: int):
    query = "DELETE FROM books WHERE book_id = :book_id RETURNING *"
    return await database.fetch_one(query=query, values={"book_id": book_id})

# Function to get all books from the books table
async def get_all_books_from_db():
    query = """
    SELECT b.book_id, b.book_name, b.book_quantity, b.book_description, b.book_pic, g.genre_name
    FROM books b
    LEFT JOIN genre g ON b.genre_id = g.genre_id;
    """
    return await database.fetch_all(query)

# Function to get all genres from the genre table
async def get_all_genres_from_db():
    query = """
    SELECT genre_id, genre_name, genre_description
    FROM genre;
    """
    return await database.fetch_all(query)


