
import requests


def google_search(query, api_key, search_engine_id):
    """
    Performs a Google Custom Search API request and retrieves search results.

    Args:
        query (str): The search query string.
        api_key (str): The API key for authenticating requests to the Google Custom Search API.
        search_engine_id (str): The custom search engine ID to use for the search.

    Returns:
        dict: The JSON response containing search results if the request is successful.

    Raises:
        Exception: If the request fails or returns an error status code.
    """
    # Define the endpoint URL for the Google Custom Search API
    url = "https://www.googleapis.com/customsearch/v1"
    
    # Define the parameters for the API request
    params = {
        'key': api_key,              # API key for authorization
        'cx': search_engine_id,      # Custom search engine ID
        'q': query,                  # Search query
    }
    
    # Send the GET request to the Google Custom Search API
    response = requests.get(url, params=params)
    
    # Check if the response status code indicates success
    if response.status_code == 200:
        # Parse and return the JSON response containing search results
        results = response.json()
        return results
    else:
        # Raise an exception if the request was unsuccessful
        raise Exception(f"Error: {response.status_code} - {response.text}")
    
    


def searched_data(results):
    """
    Extracts and formats search result data into a list of documents.

    Args:
        results (dict): The JSON response from the Google Custom Search API containing search results.

    Returns:
        list of dict: A list of dictionaries, each containing formatted search result data.
    """
    # Initialize an empty list to store the formatted documents
    documents = []
    
    # Iterate through each item in the 'items' list from the search results
    for item in results.get('items', []):
        # Extract relevant fields from each search result item
        title = item.get('title')
        link = item.get('link')
        snippet = item.get('snippet')
        
        # Extract the favicon URL from the 'pagemap' if available
        favicon_url = None
        pagemap = item.get('pagemap', {})
        if 'cse_image' in pagemap:
            favicon_url = pagemap['cse_image'][0].get('src')
        
        # Append the formatted document to the list
        documents.append({
            'title': title,
            'link': link,
            'snippet': snippet,
            'favicon_url': favicon_url
        })

    return documents

