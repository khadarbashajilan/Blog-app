from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..main import get_db
from sqlalchemy.orm import Session
from .. import schemas
from ..repository import blog

router = APIRouter(prefix='/blog', tags=['blog'])


# Create
# Define a POST endpoint to create a new blog post
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowBlog)
def create(req: schemas.BlogBase, db: Session = Depends(get_db)):
    return blog.create(req,db)

# GET
@router.get('/', response_model=List[schemas.ShowBlog])
def get_all(db:Session = Depends(get_db)):# -> Any:
    return blog.get_all(db)

# GET
@router.get('/{id}', response_model=schemas.Blog)
def get_blog(id: int, db: Session = Depends(get_db)):
    return blog.get_blog(id,db)
        

# Delete  
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id:int, db:Session = Depends(get_db)):
    return blog.delete_blog(id, db)

# Update
@router.put('/{id}', response_model=schemas.Blog)
def update(id: int, req: schemas.UpdatedBlog, db: Session = Depends(get_db)): # id from URL, req from JSON
    return blog.update(id,req,db)