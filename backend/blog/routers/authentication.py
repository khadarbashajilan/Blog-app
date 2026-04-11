from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

# Importing internal modules
from .. import schemas, database, models, hashing, token

# Initialize the router with a tag for automated documentation grouping
router = APIRouter(tags=['Authentication'])

@router.post("/login", response_model=schemas.Token)
def login(request: schemas.Login, db: Session = Depends(database.get_db)):
    """
    Verifies user credentials and returns a success message or error.
    
    - **mail**: User's registered email address
    - **password**: Plain text password to be verified
    """

    # 1. Attempt to retrieve the user by email
    # We use .first() because 'mail' should be unique in the database
    user = db.query(models.User).filter(models.User.mail == request.mail).first()

    # 2. Security: Define a generic exception to prevent "User Enumeration" attacks.
    # This ensures an attacker doesn't know if the email exists or not.
    invalid_credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 3. Validate user existence
    if not user:
        raise invalid_credentials_exception

    # 4. Verify the provided password against the stored hash
    # user.password is now recognized as a string thanks to Mapped[str]
    if not hashing.Hash.verify(request.password, user.password):
        raise invalid_credentials_exception
    
    access_token_expires = timedelta(minutes=token.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(
        data={"sub": user.mail}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
    
    # 5. Finalize login
    # In a production environment, you would generate and return a JWT here.
    # return {"message": "Login successful", "status": "authorized"}