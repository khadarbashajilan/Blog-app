from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import authentication
from . import models
from .database import engine, get_db
from .routers import blog
from .routers import user

# Create a FastAPI application instance
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create all database tables based on model definitions if they don't already exist
models.Base.metadata.create_all(engine)

# Include routers with the '/api' prefix
app.include_router(authentication.router, prefix="/api")

app.include_router(blog.router, prefix="/api")

app.include_router(user.router, prefix="/api")