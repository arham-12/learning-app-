import os
import pymongo  
from typing import Dict
from jose import JWTError, jwt
from .auth import get_password_hash
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

# Load the algorithm used for encoding/decoding JWT tokens from environment variables
ALGORITHM = os.getenv('ALGORITHM')

# Set the expiration time for access tokens (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Load the secret key used for encoding/decoding JWT tokens from environment variables
SECRET_KEY = os.getenv('SECRET_KEY')

# Initialize OAuth2PasswordBearer with the URL for the login endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_users_db():
    """
    Connects to the MongoDB server and retrieves the 'users' database.

    Returns:
        pymongo.database.Database: The 'users' database instance from MongoDB.
    """
    # Create a connection to the MongoDB server
    client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")
    
    # Retrieve the 'users' database
    return client.get_database("users")

def create_user(user: dict):
    """
    Inserts a new user document into the 'users' collection in the MongoDB database.

    Args:
        user (dict): A dictionary containing user information, including 'password'.

    Returns:
        pymongo.results.InsertOneResult: The result of the insertion operation.
    """
    # Retrieve the 'users' database
    db = get_users_db()
    
    # Hash the user's password before storing it
    user["password"] = get_password_hash(user["password"])
    
    # Insert the user document into the 'users' collection
    return db.users.insert_one(user)   

def get_user(username):
    """
    Retrieves a user document from the 'users' collection based on the provided username.

    Args:
        username (str): The username of the user to be retrieved.

    Returns:
        dict or None: The user document if found, otherwise None.
    """
    # Retrieve the 'users' database
    db = get_users_db()
    
    # Find and return the user document matching the provided username
    return db.users.find_one({"username": username})

def get_email(email):
    """
    Retrieves a user document from the 'users' collection based on the provided email address.

    Args:
        email (str): The email address of the user to be retrieved.

    Returns:
        dict or None: The user document if found, otherwise None.
    """
    # Retrieve the 'users' database
    db = get_users_db()
    
    # Find and return the user document matching the provided email address
    return db.users.find_one({"email": email})



async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, str]:
    """
    Retrieves the current user based on the provided JWT token.

    Args:
        token (str): The JWT token provided in the authorization header.

    Returns:
        Dict[str, str]: A dictionary containing the username extracted from the token.

    Raises:
        HTTPException: If the token is invalid or cannot be decoded.
    """
    # Define the exception to be raised if credentials cannot be validated
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT token to extract the payload
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Extract the username from the payload
        username: str = payload.get("sub")
        if username is None:
            # Raise an exception if the username is not found in the token
            raise credentials_exception
        # Return the username as part of the response
        return {"username": username}
    except JWTError:
        # Raise an exception if there is an error during token decoding
        raise credentials_exception

