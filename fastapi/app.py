from typing import Union
from fastapi import FastAPI, HTTPException
from database import *  # Your database connection setup
from routes.users import router as users_router  # Import users router
from routes.books import router as books_router  # Import books router
from routes.genres import router as genres_router  # Import genres router

app = FastAPI()

# Register the users and books routers
app.include_router(users_router, prefix="/api")
app.include_router(books_router, prefix="/api")  
app.include_router(genres_router, prefix="/api")# Register the books routes here

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()
