import os 
import traceback
from typing import Dict
from fastapi import APIRouter
from fastapi import File,UploadFile
from fastapi import HTTPException,Depends
from ..models import get_current_user
from ..schemas import URL,QueryRequest,Quiz
from ..utility_functions import (
    data_from_pdf,
    data_from_website,
    get_chunks,
    get_vectorstore,
    handle_user_input,
    retrieve_context_for_quiz,
    prepare_input_for_model,
    generate_quiz_response
)

router = APIRouter()


vectorstore_for_url  = None
vectorstore_for_pdf = None

@router.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Uploads a PDF file, processes it, and updates the vector store.

    Args:
        file (UploadFile): The PDF file to be uploaded and processed.

    Returns:
        dict: A response message indicating readiness for chat.

    Raises:
        HTTPException: If there is an error during file processing or vector store update.
    """
    global vectorstore_for_pdf

    try:
        # Define the temporary file path
        file_path = f"temp_{file.filename}"
        
        # Save the uploaded file temporarily to the specified path
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Process the PDF file to extract data
        data = data_from_pdf(file_path)
        
        # Split the data into text chunks
        text_chunks = get_chunks(data)
        
        # Update the vector store with the new text chunks
        vectorstore_for_pdf = get_vectorstore(text_chunks)
        
        # Optionally, remove the temporary file after processing
        os.remove(file_path)

        # Return a success message
        return {"response": "You are ready for chat!"}

    except Exception as e:
        # Handle exceptions by returning an HTTP 500 error with the exception details
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/website_url/")
async def website_url(urls: URL):
    """
    Processes the content of a website URL, updates the vector store, and prepares the system for chat.

    Args:
        urls (URL): An object containing the URL of the website to be processed.

    Returns:
        dict: A response message indicating readiness for chat.

    Raises:
        HTTPException: If there is an error during data processing or vector store update.
    """
    global vectorstore_for_url
    
    try:
        # Fetch and process data from the provided website URL
        data = data_from_website(urls.url)
        
        # Split the data into text chunks for further processing
        text_chunks = get_chunks(data)
        
        # Update the vector store with the processed text chunks
        vectorstore_for_url = get_vectorstore(text_chunks)
        
        # Log the size of the vector store for debugging
        print(f"Vectorstore initialized with data from website. Size: {len(text_chunks)} chunks.")
        
        # Return a success message
        return {"response": "You are ready for chat!"}

    except Exception as e:
        # Log the full traceback and raise an HTTP 500 error with detailed information
        traceback_str = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error in handle_user_input: {str(e)}\n{traceback_str}")




@router.post("/query")
async def query_from_document(query: QueryRequest, current_user: Dict[str, str] = Depends(get_current_user)):
    """
    Handles a query from the user by processing the provided question and returning a response.

    Args:
        query (QueryRequest): The query object containing the user's question.
        current_user (Dict[str, str]): The current user information obtained from JWT authentication.

    Returns:
        dict: The response containing the result of processing the user query.

    Raises:
        HTTPException: If the vector store is not initialized or if an error occurs during query handling.
    """
    try:
        # Check if the vector store is initialized
        if vectorstore_for_pdf is None and vectorstore_for_url is None:
            raise HTTPException(status_code=500, detail="First Learn Somthing!")
        # Extract the user question from the query
        user_question = query.user_question
        
        # Extract the username from the current_user dictionary for session identification
        session_id = current_user["username"]
        
        # Check if the  PDF vector store is initialized
        if vectorstore_for_pdf is not None:
            # Process the user question and retrieve content from PDF and returning the response
            response_content = handle_user_input(user_question=user_question, session_id=session_id, vectorstore=vectorstore_for_pdf)
            return {"response": response_content}
        
        # Check if the URL vector store is initialized
        if vectorstore_for_url is not None:
            # Process the user question and retrieve content from url and returning the response
            response_content = handle_user_input(user_question=user_question, session_id=session_id, vectorstore=vectorstore_for_url)
            return {"response": response_content}


    except Exception as e:
        # Log the full traceback and raise an HTTP 500 error with detailed information
        traceback_str = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error in handle_user_input: {str(e)}\n{traceback_str}")



@router.post("/generate_quiz")
async def generate_quiz(quiz: Quiz):
    """
    Generates a quiz based on the provided topic and number of questions.

    Args:
        quiz (Quiz): An object containing the topic and number of questions for the quiz.

    Returns:
        dict: A response containing the generated quiz content.

    Raises:
        HTTPException: If the vector store is not initialized or if an error occurs during quiz generation.
    """
    try:
        # Initialize an empty list for relevant contexts
        contexts = []

        # Check if both vector stores are initialized
        if vectorstore_for_pdf is not None:
            # Retrieve context from the PDF vector store
            pdf_context = retrieve_context_for_quiz(quiz.topic, vectorstore_for_pdf)
            contexts.append(pdf_context)

        if vectorstore_for_url is not None:
            # Retrieve context from the URL vector store
            url_context = retrieve_context_for_quiz(quiz.topic, vectorstore_for_url)
            contexts.append(url_context)

        # If no vector stores are initialized, return a message
        if not contexts:
            return {"response": "First learn something. Then validate yourself."}
        
        # Prepare the input prompt for the model
        prompt = prepare_input_for_model(quiz.topic, contexts, quiz.num_questions)
        
        # Generate the quiz based on the prepared prompt
        response = generate_quiz_response(prompt)

        # Return the generated quiz content
        return {"response": response.content}
    
    except Exception as e:
        # Log the full traceback and raise an HTTP 500 error with detailed information
        traceback_str = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error in generate_quiz: {str(e)}\n{traceback_str}")