from typing import Optional # Import for optional fields
from pydantic import BaseModel # Import base validation class


class BlogBase(BaseModel): # Create a base to share fields
    title: str # Required title
    body: str # Required body

class BlogCreate(BlogBase): # Used for POST requests
    pass # Uses title and body from base

class Blog(BlogBase): # Used for RESPONSES (contains the ID)
    id: int # The database ID must be defined here to avoid validation errors

    class Config: # Configuration for Pydantic
        from_attributes = True # Crucial: Allows Pydantic to read SQLAlchemy objects

class UpdatedBlog(BaseModel): # Used for PATCH requests
    title: Optional[str] = None # Optional title
    body: Optional[str] = None # Optional body
    
    
class Userdetails(BaseModel):
    name : str
    password :str
    mail: str 

class User(BaseModel):
    name : str
    mail : str
    # class Config:
    #     from_attributes = True