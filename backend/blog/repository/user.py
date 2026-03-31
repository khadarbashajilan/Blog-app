from fastapi import Depends, HTTPException, status
from pydantic import EmailStr, TypeAdapter
from ..main import get_db
from sqlalchemy.orm import Session
from .. import models, schemas
from .. import hashing

def register(req:schemas.UserCreate, db:Session = Depends(get_db)):
    
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
