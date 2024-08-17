from fastapi import APIRouter, HTTPException, status, Depends
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from ..schemas import Token, User  #Login
from ..models import get_email, create_user, get_user, get_current_user
from ..auth import create_access_token,verify_password

router = APIRouter()


@router.post("/signup", response_model=Token)
async def signup(user: User) -> dict:
    """
    Registers a new user and generates an access token.

    Args:
        user (User): The user data including username, email, and password.

    Returns:
        dict: A dictionary containing the access token and token type.

    Raises:
        HTTPException: If the email is already registered.
    """
    # Check if the email is already registered
    existing_user = get_email(user.email)
    
    if not existing_user:
        # Create a new user if the email is not registered
        create_user(dict(user))
    elif existing_user["email"] == user.email:
        # Raise an HTTP 401 Unauthorized error if the email is already registered
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email already registered",
        )
    
    # Create an access token for the newly registered user
    access_token = create_access_token(data={"sub": user.username})
    
    # Return the access token and its type
    return {"access_token": access_token, "token_type": "bearer"}



@router.post("/login", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> dict:
    """
    Authenticates a user and generates an access token.

    Args:
        form_data (OAuth2PasswordRequestForm): The form data containing username and password.

    Returns:
        dict: A dictionary containing the access token and token type.

    Raises:
        HTTPException: If the username or password is incorrect.
    """
    # Retrieve the user based on the provided username
    user = get_user(form_data.username)
    
    # Verify the user's password
    if not user or not verify_password(form_data.password, user["password"]):
        # Raise an HTTP 401 Unauthorized error if authentication fails
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create an access token for the authenticated user
    access_token = create_access_token(data={"sub": user["username"]})
    
    # Return the access token and its type
    return {"access_token": access_token, "token_type": "bearer"}