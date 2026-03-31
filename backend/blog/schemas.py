from pydantic import BaseModel # Import base validation class
from typing import Optional, List    # Import for optional fields and forward references




class BlogBase(BaseModel): # Create a base to share fields
    title: str # Required title
    body: str # Required body
    # user_id:int
    # class Config: # Configuration for Pydantic
    #     from_attributes = True # Crucial: Allows Pydantic to read SQLAlchemy objects
    

class UpdatedBlog(BaseModel): # Used for PATCH requests
    title: Optional[str] = None # Optional title
    body: Optional[str] = None # Optional body
    
    
class User(BaseModel):
    name : str
    mail : str

    
class Userdetails(BaseModel):
    name : str
    password :str
    mail: str 
    
class ShowUser(BaseModel):
    name:str
    mail:str
    blogs: List[BlogBase] 

    class Config: # Configuration for Pydantic
        from_attributes = True # Crucial: Allows Pydantic to read SQLAlchemy objects

 

class ShowBlog(BlogBase):
    id:int
    user_id:int

class Blog(BaseModel): # Used for RESPONSES (contains the ID)
    title:str
    body:str
    creator: User

    class Config: # Configuration for Pydantic
        from_attributes = True # Crucial: Allows Pydantic to read SQLAlchemy objects

 