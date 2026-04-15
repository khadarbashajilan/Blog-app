from fastapi import Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from blog.oauth2 import get_current_user
from ..main import get_db
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas
from fastapi.responses import JSONResponse  



def create(req: schemas.BlogBase, current_user_mail:str, db: Session = Depends(get_db)):
    """
    Create a new blog post.

    Args:
        req: Blog data to create
        db: Database session

    Returns:
        The created blog post
    """

    try:
        current_user = db.query(models.User).filter(models.User.mail == current_user_mail).first()
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        new_blog = models.Blog(title=req.title, body=req.body, user_id=current_user.id)
        
        # Add the new blog to the database session
        db.add(new_blog)
        # Commit the transaction to save the data
        db.commit()
        # Refresh the instance to get the generated ID and other defaults
        db.refresh(new_blog)
    except Exception as e :
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
        
def delete_blog(id:int, current_user_mail:str, db:Session = Depends(get_db)):
    """
    Delete a specific blog post by ID.

    Args:
        id: ID of the blog post to delete
        db: Database session

    Returns:
        JSON response with success message
    """
    
    try:
        # Validate the id parameter
        if id <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid blog ID"
            )

        # Query the user by email
        current_user = db.query(models.User).filter(models.User.mail == current_user_mail).first()
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Query the blog post by ID and user ID
        blog = db.query(models.Blog).filter(
            models.Blog.id == id,
            models.Blog.user_id == current_user.id
        ).first()

        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Blog with id {id} not found"
            )

        # Delete the blog post
        db.delete(blog)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": f"Blog with id {id} deleted successfully"}
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

def update(id: int, req: schemas.UpdatedBlog,current_user_mail:str, db: Session = Depends(get_db)): # id from URL, req from JSON
    current_user = db.query(models.User).filter(models.User.mail == current_user_mail).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    
    update_data = req.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided"
        )
    
    try:
        # Convert string keys to column objects
        update_columns = {
            getattr(models.Blog, key): value
            for key, value in update_data.items()
        }

        # Update with authorization
        result = db.query(models.Blog).filter(
            models.Blog.id == id,
            models.Blog.user_id == current_user.id
        ).update(update_columns, synchronize_session=False)

        if result == 0:
            blog_exists = db.query(models.Blog).filter(
                models.Blog.id == id
            ).first()
            
            if not blog_exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Blog with id {id} not found"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to update this blog"
                )

        db.commit()
        updated_blog = db.query(models.Blog).options(
            joinedload(models.Blog.creator)
        ).filter(models.Blog.id == id).first()

        return updated_blog

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error - update conflicts with constraints"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update blog: {str(e)}"
        )
        
        
    
