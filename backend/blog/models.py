# Import SQLAlchemy components for defining database columns and data types
from sqlalchemy import Column, Integer, String, ForeignKey  # Import necessary SQLAlchemy components
# Import the base class for declarative models from the database configuration
from .database import Base  # Import the base class for declarative models

from sqlalchemy.orm import relationship  # Import the relationship function for defining relationships between models

# Define a Blog model class that inherits from the declarative base
class Blog(Base):  # Define the Blog model class
    # Specify the table name in the database
    __tablename__ = 'blogs'  # Set the table name to 'blogs'
    # Define an integer column as the primary key with indexing for performance
    id = Column(Integer, primary_key=True, index=True)  # Define the primary key column
    # Define a string column for blog titles
    title = Column(String)  # Define the title column
    # Define a string column for blog content
    body = Column(String)  # Define the body column

    user_id = Column(Integer, ForeignKey('users.id'))  # Define the user_id column as a foreign key

    creator = relationship("User", back_populates='blogs')  # Define the relationship with the User model

class User(Base):  # Define the User model class
    __tablename__ = 'users'  # Set the table name to 'users'

    id = Column(Integer, primary_key=True, index=True)  # Define the primary key column
    name = Column(String)  # Define the name column
    mail = Column(String)  # Define the mail column
    password = Column(String)  # Define the password column

    blogs = relationship('Blog', back_populates='creator')  # Define the relationship with the Blog model
    