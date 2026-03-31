# Import necessary modules from FastAPI and SQLAlchemy
from fastapi import FastAPI, Depends, HTTPException, status, Response
from . import schemas, models, hashing
from .database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from pydantic import EmailStr, TypeAdapter
# Create a FastAPI application instance
app = FastAPI()

# Create a database session generator function that handles session lifecycle
def get_db():
# Create a new database session instance
    db = SessionLocal()
    try:
        # Yield the session to be used in the route handler
        yield db
    finally:
        # Ensure the session is properly closed after use
        db.close()

# Create all database tables based on model definitions if they don't already exist
models.Base.metadata.create_all(engine)

# Create
# Define a POST endpoint to create a new blog post
@app.post("/blog", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowBlog, tags=['blogs'])
def create(req: schemas.BlogBase, db: Session = Depends(get_db)):
    """
    Create a new blog post.

    Args:
        req: Blog data to create
        db: Database session

    Returns:
        The created blog post
    """
    # Create a new Blog model instance with data from the request
    new_blog = models.Blog(title=req.title, body=req.body, user_id = 2)

    try:
        # Add the new blog to the database session
        db.add(new_blog)
        # Commit the transaction to save the data
        db.commit()
        # Refresh the instance to get the generated ID and other defaults
        db.refresh(new_blog)
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

    # Return the created blog data
    return new_blog

# Read
# Define a GET endpoint to retrieve all blog posts
@app.get('/blog', response_model=list[schemas.Blog], tags=['blogs'])
def all(db: Session = Depends(get_db)):
    """
    Retrieve all blog posts.

    Returns:
        List of all blog posts
    """
    try:
        # Query all blog posts from the database
        all_blogs = db.query(models.Blog).all()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

    # Return the list of all blog posts
    return all_blogs

@app.get('/blog/{id}', response_model=schemas.Blog, tags=['blogs'])
def get_blog(id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific blog post by ID.

    Args:
        id: ID of the blog post to retrieve
        db: Database session

    Returns:
        The requested blog post
    """
    try:
        # Query the database for a blog with the specified ID
        blog = db.query(models.Blog).filter(models.Blog.id == id).first()

        # If the blog doesn't exist, return a 404 error
        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Blog with id {id} not found"
            )

        # Return the found blog
        return blog
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

# Delete  
@app.delete('/blog/{id}', status_code=status.HTTP_204_NO_CONTENT, tags=['blogs'])
def delete_blog(id:int, db:Session = Depends(get_db)):
    """
    Delete a specific blog post by ID.

    Args:
        id: ID of the blog post to delete
        db: Database session

    Returns:
        JSON response with success message
    """
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    
    if not blog:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Blog with id {id} not found"
    )
    
    db.delete(blog)
    db.commit()
    
    return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": f"Blog with id {id} deleted successfully"}
        )

# Update
@app.put('/blog/{id}', response_model=schemas.Blog, tags=['blogs'])
def update(id: int, req: schemas.UpdatedBlog, db: Session = Depends(get_db)): # id from URL, req from JSON
    # Query for the specific blog record
    blog_query = db.query(models.Blog).filter(models.Blog.id == id) # Prepare query
    # Retrieve the object from the database
    db_blog = blog_query.first() # Execute query

    if not db_blog: # Check if record exists
        # Raise 404 if not found
        raise HTTPException(status_code=404, detail="Blog not found") # Exit logic

    # Create a dictionary of only the fields actually provided in the request
    # update_data = req.model_dump(exclude_unset=True) # ignores None values

    # Update the database record efficiently
    # blog_query.update(update_data, synchronize_session=False) # Apply dictionary to the database

    
    # or :    
    # Create a dictionary to store the update data for the blog post
    # Convert dictionary keys from strings to SQLAlchemy column objects
    update_data = {
    # Set the attribute of the Blog model corresponding to the key to the provided value
    getattr(models.Blog, key): value
    # Iterate over the key-value pairs in the request data, excluding unset fields
    for key, value in req.model_dump(exclude_unset=True).items()
    } 
    blog_query.update(update_data, synchronize_session=False)  
    # Update the database record with the modified dictionary    

    db.commit() # Save changes
    db.refresh(db_blog) # Reload object to include the id and updated fields
    return db_blog # Return the object (FastAPI validates this against schemas.Blog)


@app.post('/user', response_model=schemas.User)
def register(req:schemas.Userdetails, db:Session = Depends(get_db)):
    
    # validate the mail
    try:
        TypeAdapter(EmailStr).validate_python(req.mail)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Email ID")        
    
    #check duplis mail
    existing_user = db.query(models.User).filter(models.User.mail == req.mail).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # hash the password
    hashed_pass = hashing.Hash.bcrypt(req.password)
    new_user = models.User(name = req.name, password = hashed_pass, mail = req.mail)
    
    # insert to db
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    return new_user

@app.get('/user/{id}', response_model=schemas.ShowUser)
def show_users(id:int, db:Session = Depends(get_db)):
    try:
        user = db.query(models.User).filter(models.User.id == id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {id} not found"
            )
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
