from fastapi import FastAPI

from .routers import authentication
from . import models
from .database import engine, get_db
from .routers import blog
from .routers import user

# Create a FastAPI application instance
app = FastAPI()

# Create all database tables based on model definitions if they don't already exist
models.Base.metadata.create_all(engine)

# Include routers
app.include_router(authentication.router)

app.include_router(blog.router)

app.include_router(user.router)