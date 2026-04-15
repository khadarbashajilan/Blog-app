from typing import List
from fastapi import APIRouter, Depends, status
from ..main import get_db
from sqlalchemy.orm import Session
from .. import schemas
from ..oauth2 import get_current_user
from ..repository import blog

router = APIRouter(prefix='/blog', tags=['blog'])


# Create
# Define a POST endpoint to create a new blog post
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowBlog)
def create(req: schemas.BlogBase, db: Session = Depends(get_db), current_user:schemas.User = Depends(get_current_user)):
    return blog.create(req, current_user.mail, db)

# GET
@router.get('/', response_model=List[schemas.ShowBlog])
def get_all(db:Session = Depends(get_db), current_user:schemas.UserCreate = Depends(get_current_user)):# -> Any:
    return blog.get_all(db)

# GET
@router.get('/{id}', response_model=schemas.Blog)
def get_blog(id: int, db: Session = Depends(get_db), current_user:schemas.UserCreate = Depends(get_current_user)):
    return blog.get_blog(id,db)
        

# Delete  
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id:int, db:Session = Depends(get_db), current_user:schemas.UserCreate = Depends(get_current_user)):
    return blog.delete_blog(id,current_user.mail, db)

# Update
@router.put('/{id}')
def update(id: int, req: schemas.UpdatedBlog, db: Session = Depends(get_db), current_user:schemas.UserCreate = Depends(get_current_user)): # id from URL, req from JSON
    print(current_user)
    return blog.update(id,req,current_user.mail,db)