from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import token as tknfile
# import logging

oauth2_schema = OAuth2PasswordBearer(tokenUrl='login')

def get_current_user(token: str = Depends(oauth2_schema)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # logger.info(f"Verifying token: {token}")
        token_data = tknfile.verify_token(token, credentials_exception)
        # logger.info(f"Token data: {token_data}")
        return token_data
    except Exception as e:
        # logger.error(f"Error verifying token: {e}")
        raise credentials_exception