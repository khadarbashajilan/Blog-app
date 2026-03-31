from fastapi import APIRouter, Depends
from ..repository import user
from ..main import get_db
from sqlalchemy.orm import Session
from .. import schemas
from ..repository import user


router = APIRouter(prefix='/user', tags=['user'])

@router.post('/', response_model=schemas.ShowUser)
def register(req:schemas.UserCreate, db:Session = Depends(get_db)):
    return user.register(req,db)

@router.get('/{id}', response_model=schemas.ShowUser)
def show_users(id:int, db:Session = Depends(get_db)):
    return user.show_users(id,db)
