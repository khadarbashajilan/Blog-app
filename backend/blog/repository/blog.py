from fastapi import Depends, HTTPException, status
from ..main import get_db
from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi.responses import JSONResponse  



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
    
def get_all(db:Session = Depends(get_db)):
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
    # blog_query.update(update_data, synchronize_session=False) # routerly dictionary to the database

    
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
