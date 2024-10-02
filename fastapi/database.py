from databases import Database
from typing import Optional
from datetime import datetime

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

# Function to get all users with borrow count
async def get_all_users_with_borrow_count():
    query = """
    SELECT u.user_id, u.username, u.email, COUNT(b.borrow_id) AS total_borrows
    FROM users u
    LEFT JOIN borrow b ON u.user_id = b.user_id
    GROUP BY u.user_id;
    """
    return await database.fetch_all(query)


# -------------------- BOOK OPERATIONS --------------------

# Function to insert a new book into the books table with genre_id
async def insert_book(book_name: str, book_quantity: int, book_description: Optional[str], book_pic: Optional[str], genre_id: Optional[int]):

    query = """
    INSERT INTO books (book_name, book_quantity, book_description, book_pic, genre_id, available_quantity)
    VALUES (:book_name, :book_quantity, :book_description, :book_pic, :genre_id, :book_quantity)
    RETURNING book_id, book_name, book_quantity, available_quantity, book_description, book_pic, genre_id
    """
    values = {
        "book_name": book_name,
        "book_quantity": book_quantity,
        "book_description": book_description,
        "book_pic": book_pic,
        "genre_id": genre_id
    }
    return await database.fetch_one(query=query, values=values)

# Function to select a book by book_id from the books table with genre details
async def get_book(book_id: int):
    query = """
    SELECT b.book_id, b.book_name, b.book_quantity, b.available_quantity, b.book_description, b.book_pic, b.genre_id, g.genre_name
    FROM books b
    LEFT JOIN genre g ON b.genre_id = g.genre_id
    WHERE b.book_id = :book_id
    """
    return await database.fetch_one(query=query, values={"book_id": book_id})

# Function to update a book in the books table, including genre_id
# async def update_book(book_id: int, book_name: Optional[str], book_quantity: Optional[int], book_description: Optional[str], book_pic: Optional[str], genre_id: Optional[int]):
#     query = """
#     UPDATE books
#     SET book_name = COALESCE(:book_name, book_name), 
#         book_quantity = COALESCE(:book_quantity, book_quantity), 
#         book_description = COALESCE(:book_description, book_description), 
#         book_pic = COALESCE(:book_pic, book_pic),
#         genre_id = COALESCE(:genre_id, genre_id)
#     WHERE book_id = :book_id
#     RETURNING book_id, book_name, book_quantity, book_description, book_pic, genre_id
#     """
#     values = {
#         "book_id": book_id,
#         "book_name": book_name,
#         "book_quantity": book_quantity,
#         "book_description": book_description,
#         "book_pic": book_pic,
#         "genre_id": genre_id
#     }
#     return await database.fetch_one(query=query, values=values)

async def update_book(book_id: int, book_name: str, book_quantity: Optional[int], available_quantity: Optional[int], book_description: Optional[str], book_pic: Optional[str], genre_id: Optional[int]):
    query = """
    UPDATE books 
    SET book_name = :book_name, book_quantity = :book_quantity, available_quantity = :available_quantity, book_description = :book_description, book_pic =:book_pic, genre_id = :genre_id
    WHERE book_id = :book_id
    RETURNING book_id, book_name, book_quantity, available_quantity, book_description, book_pic, genre_id
    """
    values = {
        "book_id": book_id,
        "book_name": book_name,
        "book_quantity": book_quantity,
        "available_quantity": available_quantity,
        "book_description": book_description,
        "book_pic": book_pic,
        "genre_id": genre_id
    }
    return await database.fetch_one(query=query, values=values)




# Function to delete a user from the users table
async def delete_book(book_id: int):
    query = "DELETE FROM books WHERE book_id = :book_id RETURNING *"
    return await database.fetch_one(query=query, values={"book_id": book_id})



# Function to get all books from the books table along with genre details
async def get_all_books_from_db():
    query = """
    SELECT b.book_id, b.book_name, b.book_quantity,b.available_quantity, b.book_description, b.book_pic, b.genre_id, g.genre_name
    FROM books b
    LEFT JOIN genre g ON b.genre_id = g.genre_id;
    """
    return await database.fetch_all(query)


# -------------------- GENRE OPERATIONS --------------------

# Function to get all genres from the genre table
async def get_all_genres_from_db():
    query = """
    SELECT genre_id, genre_name, genre_description
    FROM genre;
    """
    return await database.fetch_all(query)

async def get_genres_with_books_from_db():
    query = """
    SELECT g.genre_id, g.genre_name, g.genre_description, b.book_id, b.book_name
    FROM genre g
    LEFT JOIN books b ON g.genre_id = b.genre_id
    """
    return await database.fetch_all(query)


# Function to insert a new borrow into the borrows table
async def insert_borrow(user_id: int, book_id: int, borrow_quantity: int):
    query = """
    INSERT INTO borrow (user_id, book_id, borrow_quantity)
    VALUES (:user_id, :book_id, :borrow_quantity)
    RETURNING borrow_id, user_id, book_id, borrow_quantity, borrow_date, return_date
    """
    values = {"user_id": user_id, "book_id": book_id, "borrow_quantity": borrow_quantity}
    return await database.fetch_one(query=query, values=values)

# Function to update the return date of a borrow by borrow_id
async def update_borrow_return_date(borrow_id: int, return_date: Optional[datetime]):
    query = """
    UPDATE borrow 
    SET return_date = :return_date
    WHERE borrow_id = :borrow_id
    RETURNING borrow_id, user_id, book_id, borrow_quantity, borrow_date, return_date
    """
    values = {"borrow_id": borrow_id, "return_date": return_date}
    return await database.fetch_one(query=query, values=values)


# Function to select a borrow by borrow_id
async def get_borrow(borrow_id: int):
    query = """
    SELECT 
        b.borrow_id, 
        b.user_id, 
        u.username,  -- Join to get user_name
        b.book_id, 
        bk.book_name,  -- Join to get book_name
        b.borrow_quantity, 
        b.borrow_date, 
        b.return_date
    FROM borrow b
    JOIN users u ON b.user_id = u.user_id
    JOIN books bk ON b.book_id = bk.book_id
    WHERE borrow_id = :borrow_id
    """
    return await database.fetch_one(query=query, values={"borrow_id": borrow_id})

# Function to delete a borrow by borrow_id
async def delete_borrow(borrow_id: int):
    query = "DELETE FROM borrow WHERE borrow_id = :borrow_id RETURNING *"
    return await database.fetch_one(query=query, values={"borrow_id": borrow_id})

# # Function to get all borrows
# async def get_all_borrows_from_db():
#     query = "SELECT * FROM borrow"
#     return await database.fetch_all(query)

async def get_all_borrows_from_db():
    query = """
    SELECT 
        b.borrow_id, 
        b.user_id, 
        u.username,  -- Join to get user_name
        b.book_id, 
        bk.book_name,  -- Join to get book_name
        b.borrow_quantity, 
        b.borrow_date, 
        b.return_date
    FROM borrow b
    JOIN users u ON b.user_id = u.user_id
    JOIN books bk ON b.book_id = bk.book_id
    """
    return await database.fetch_all(query)


async def update_book_quantity_on_borrow(book_id: int, borrow_quantity: int):
    query = """
    UPDATE books
    SET available_quantity = available_quantity - :borrow_quantity
    WHERE book_id = :book_id AND available_quantity >= :borrow_quantity
    RETURNING available_quantity
    """
    values = {"book_id": book_id, "borrow_quantity": borrow_quantity}
    return await database.fetch_one(query=query, values=values)

async def update_book_quantity_on_return(book_id: int, borrow_quantity: int):
    query = """
    UPDATE books
    SET available_quantity = available_quantity + :borrow_quantity
    WHERE book_id = :book_id
    RETURNING available_quantity
    """
    values = {"book_id": book_id, "borrow_quantity": borrow_quantity}
    return await database.fetch_one(query=query, values=values)
