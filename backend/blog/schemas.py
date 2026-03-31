from pydantic import BaseModel, ConfigDict
from typing import Optional, List

# --- BASE MODELS (shared fields) ---

class BlogBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    title: str
    body: str


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    mail: str


# --- REQUEST MODELS (inputs) ---

class UserCreate(UserBase):
    password: str


class BlogCreate(BlogBase):
    pass


class UpdatedBlog(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None


# --- RESPONSE MODELS (outputs) ---

class ShowUser(UserBase):
    id: int
    blogs: List[BlogBase] = []


class ShowBlog(BlogBase):
    id: int
    user_id: int


class Blog(BlogBase):
    id: int
    creator: UserBase

class Login(BaseModel):
    mail:str
    password:str
    # name:str
