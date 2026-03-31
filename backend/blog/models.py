from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from .database import Base

class Blog(Base):
    """
    Represents a blog post entity.
    Linked to a User via the 'user_id' foreign key.
    """
    __tablename__ = 'blogs'

    # Primary key for the blog post
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Title and content of the post
    title: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(String, nullable=False)

    # Foreign Key: References the 'id' column in the 'users' table
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))

    # Relationship: Links back to the User model
    # back_populates ensures synchronization with User.blogs
    creator: Mapped["User"] = relationship("User", back_populates="blogs")


class User(Base):
    """
    Represents a user entity.
    One user can have multiple blog posts (One-to-Many).
    """
    __tablename__ = 'users'
    
    # Primary key for the user
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Basic user information
    name: Mapped[str] = mapped_column(String, nullable=False)
    mail: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    
    # Hashed password string
    password: Mapped[str] = mapped_column(String, nullable=False)

    # Relationship: Links to the Blog model
    # Mapped[List["Blog"]] tells the type checker this is a collection of Blog objects
    blogs: Mapped[List["Blog"]] = relationship("Blog", back_populates="creator")