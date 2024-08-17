import os 
import dotenv
import traceback
from typing import Dict
from fastapi import APIRouter,HTTPException
from ..learning_material import google_search,searched_data
from ..schemas import Query

# Load environment variables from a .env file
dotenv.load_dotenv()

# Retrieve the API key for Google's Custom Search from environment variables
api_key = os.getenv('GOOGLE_SEARCH_API_KEY')

# Set the custom search engine ID for Google's Custom Search
search_engine_id = "c2d39fabc93064891"

# Create a new APIRouter instance for handling API routes
router = APIRouter()


@router.post("/search_content")
async def search(query: Query, api_key: str = api_key, search_engine_id: str = search_engine_id):
    """
    Searches for content using Google's Custom Search API and returns the results.

    Args:
        query (str): The search query to be used for the Google Custom Search.
        api_key (str): The API key for accessing Google's Custom Search API.
        search_engine_id (str): The custom search engine ID for Google's Custom Search.

    Returns:
        dict: A dictionary containing the search results with titles, links, snippets, and favicon URLs.

    Raises:
        HTTPException: If an error occurs during the search process.
    """
    try:
        # Perform the search using Google's Custom Search API
        results = google_search(query.query, api_key, search_engine_id)
        
        # Process the search results to extract relevant data
        data = searched_data(results)
        
        # Return the processed search results
        return data
    
    except Exception as e:
        # Log the full traceback and raise an HTTP 500 error with detailed information
        traceback_str = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error during search: {str(e)}\n{traceback_str}")
