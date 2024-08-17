from pydantic import BaseModel


class Query(BaseModel):
    """
    Model representing a query request.

    Attributes:
        query (str): The search query string provided by the user.
    """
    query: str 

class User(BaseModel):
    """
    Model representing user data for registration and authentication.

    Attributes:
        username (str): The username of the user.
        email (str): The email address of the user.
        password (str): The password of the user, should be hashed before storage.
    """
    username: str
    email: str
    password: str

class Token(BaseModel):
    """
    Model representing an access token response.

    Attributes:
        access_token (str): The JWT access token issued to the user.
        token_type (str): The type of token (typically "bearer").
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    Model representing the data embedded in the JWT access token.

    Attributes:
        username (str | None): The username associated with the token. May be None if not present.
    """
    username: str | None = None


class URL(BaseModel):
    """
    Model representing a URL for processing.

    Attributes:
        url (str): The URL string to be processed or accessed.
    """
    url: str   

class QueryRequest(BaseModel):
    """
    Model representing a request for querying documents.

    Attributes:
        user_question (str): The question or query string from the user.
        # session_id (str): Optional session ID for tracking the user's session.
    """
    user_question: str
    # session_id: str  # Uncomment if session tracking is needed

class Quiz(BaseModel):
    """
    Model representing a quiz request.

    Attributes:
        topic (str): The topic for which the quiz is to be generated.
        num_questions (int): The number of questions to include in the quiz.
    """
    topic: str
    num_questions: int