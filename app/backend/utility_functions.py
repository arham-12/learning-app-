import os
import faiss
import dotenv
import traceback
import numpy as np
from uuid import uuid4
from fastapi import HTTPException
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.document_loaders import PyPDFLoader, web_base
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory

# Load environment variables from a .env file
dotenv.load_dotenv()

# Retrieve the API key for Groq API from environment variables
api_key = os.getenv('GROQ_API_KEY')


def data_from_website(url):
    """
    Retrieves data from a specified website URL.

    Args:
        url (str): The URL of the website from which data needs to be fetched.

    Returns:
        data: The content fetched from the website.
    """
    # Instantiate the WebBaseLoader with the provided URL to initialize the loading process
    loader = web_base.WebBaseLoader(url)
    
    # Load data from the website using the loader instance
    data = loader.load()
    
    # Return the fetched data to the caller
    return data

def data_from_pdf(file_path):
    """
    Extracts and processes data from a PDF file.

    Args:
        file_path (str): The file path of the PDF document to be processed.

    Returns:
        data: The content extracted and split from the PDF file.
    """
    # Instantiate the PyPDFLoader with the specified file path to initialize PDF processing
    loader = PyPDFLoader(file_path)
    
    # Load the PDF its content into manageable chunks
    data = loader.load()
    
    # Return the processed data
    return data

def get_chunks(pages):
    """
    Splits the content of the first page into chunks for further processing.

    Args:
        pages (list): A list of page objects, where each page contains textual content.

    Returns:
        list: A list of text chunks obtained from splitting the content of the first page.
    """
    # Initialize the RecursiveCharacterTextSplitter with specified chunk size and overlap
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=900,        # Maximum size of each chunk
        chunk_overlap=100      # Number of overlapping characters between chunks
    )
    
    # Split the content of the first page into chunks
    chunks = text_splitter.split_text(pages[0].page_content)
    
    # Return the list of text chunks
    return chunks


def generate_embedding(document):
    """
    Generates embeddings for the given document using a pre-trained model.

    Args:
        document (list of str): A list of text documents to be embedded.

    Returns:
        list: A list of embeddings corresponding to the input documents.
    """
    # Initialize the HuggingFaceInferenceAPIEmbeddings with the API key and model name
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key="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",  # API key for authentication
        model_name="sentence-transformers/all-MiniLM-l6-v2"  # Pre-trained model for generating embeddings
    )
    
    # Generate embeddings for the provided documents
    query_result = embeddings.embed_documents(document)
    
    # Return the embeddings for the documents
    return query_result


    texts = [page for page in pages]
    print(len(texts))
    # Generate embeddings
    embeddings = generate_embedding(texts)
    if not embeddings:
        raise ValueError("Generated embeddings are empty.")
    if not embeddings[0]:
        raise ValueError("The first embedding is empty.")
    # Create FAISS index
    dimension = len(embeddings[0])  # Get the embedding dimension
    index = faiss.IndexFlatL2(dimension)
    
    # Create document IDs
    uuids = [str(uuid4()) for _ in range(len(pages))]
    
    # Add embeddings to the FAISS index
    index.add(np.array(embeddings))
    
    # Create documents
    documents = [Document(page_content=page) for page in pages]
    
    # Create vector store
    vector_store = FAISS(
        embedding_function=generate_embedding,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={i: uuids[i] for i in range(len(documents))}
    )
    
    # Add documents with UUIDs
    vector_store.add_documents(documents=documents, ids=uuids)
    
    return vector_store

def get_vectorstore(pages):
    """
    Creates a vector store using FAISS for efficient similarity search.

    Args:
        pages (list): A list of text pages to be processed into embeddings and indexed.

    Returns:
        vector_store (FAISS): A FAISS vector store containing document embeddings and metadata.
    """
    # Extract text content from each page
    texts = [page for page in pages]
    print(len(texts))  # Output the number of text entries for debugging purposes
    
    # Generate embeddings for the extracted text content
    embeddings = generate_embedding(texts)
    
    # Check if embeddings were successfully generated
    if not embeddings:
        raise ValueError("Generated embeddings are empty.")
    if not embeddings[0]:
        raise ValueError("The first embedding is empty.")
    
    # Determine the dimensionality of the embeddings
    dimension = len(embeddings[0])
    
    # Initialize a FAISS index for L2 distance calculation
    index = faiss.IndexFlatL2(dimension)
    
    # Generate unique IDs for each document
    uuids = [str(uuid4()) for _ in range(len(pages))]
    
    # Add the embeddings to the FAISS index
    index.add(np.array(embeddings))
    
    # Create Document instances for each page
    documents = [Document(page_content=page) for page in pages]
    
    # Initialize the FAISS vector store with embedding function, index, and document metadata
    vector_store = FAISS(
        embedding_function=generate_embedding,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={i: uuids[i] for i in range(len(documents))}
    )
    
    # Add documents and their corresponding UUIDs to the vector store
    vector_store.add_documents(documents=documents, ids=uuids)
    
    return vector_store


def get_chat_message_history(session_id: str):
    """
    Retrieves the chat message history for a specific session from a MongoDB database.

    Args:
        session_id (str): The unique identifier for the chat session whose history is to be retrieved.

    Returns:
        MongoDBChatMessageHistory: An instance of MongoDBChatMessageHistory configured to access the specified session's chat history.
    """
    return MongoDBChatMessageHistory(
        session_id=str(session_id),  # Convert session_id to string if not already
        connection_string="mongodb://localhost:27017",  # MongoDB connection string
        database_name="history",  # Name of the database containing chat histories
        collection_name="chat_histories"  # Collection within the database where chat histories are stored
    )


def create_prompt_template():
    """
    Creates a chat prompt template for generating responses in a conversational assistant.

    Returns:
        ChatPromptTemplate: An instance of ChatPromptTemplate configured with a series of message templates.
    """
    return ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful assistant."),  # System message introducing the assistant's role
            MessagesPlaceholder(variable_name="history"),  # Placeholder for chat history
            ("human", "{question}"),  # Message template for user input, with a placeholder for the user's question
            ("system", "File content: {context}")  # System message providing additional context from a file
        ]
    )


def handle_user_input(user_question: str, session_id: str, vectorstore):
    """
    Handles user input by processing the question, retrieving relevant context, 
    and generating a response using a chat-based model with memory integration.

    Args:
        user_question (str): The question or input message from the user.
        session_id (str): The unique identifier for the chat session.
        vectorstore: The vector store used for retrieving context documents.

    Returns:
        str: The generated response content from the chat model.
    """
    try:
        # Retrieve the chat message history for the given session
        chat_message_history = get_chat_message_history(session_id)
        
        # Retrieve context documents similar to the user question from the vector store
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 2})
        context_documents = retriever.invoke(user_question)
        formatted_context = "\n".join([doc.page_content for doc in context_documents])
        
        # Create a prompt template for the chat-based model
        prompt = create_prompt_template()

        # Initialize the chat model with specific parameters
        llm = ChatGroq(temperature=0.5, model="llama-3.1-70b-versatile", api_key=api_key)

        # Create a chain by combining the prompt and the model
        chain = prompt | llm
        chain_with_history = RunnableWithMessageHistory(
            chain,
            lambda session_id: get_chat_message_history(session_id),
            input_messages_key="question",
            history_messages_key="history",
        )
        
        # Add the user’s message to the chat history
        chat_message_history.add_user_message(user_question)
        
        # Prepare inputs for the chain, including the question and formatted context
        chain_inputs = {
            "question": user_question,
            "context": formatted_context
        }

        # Execute the chain with history to generate a response
        response = chain_with_history.invoke(chain_inputs, config={"configurable": {"session_id": "<SESSION_ID>"}})

        # Add the AI’s response to the chat history
        chat_message_history.add_ai_message(response)

        # Return the content of the generated response
        return response.content
    
    except Exception as e:
        # Handle any exceptions that occur during processing
        return f"An error occurred: {str(e)}"

    
    except Exception as e:
        # Log the full traceback
        traceback_str = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error in handle_user_input: {str(e)}\n{traceback_str}")
        

def retrieve_context_for_quiz(topic, vectorstore):
    """
    Retrieves and combines context documents relevant to a given topic for quiz generation.

    Args:
        topic (str): The topic or query for which relevant context documents are to be retrieved.
        vectorstore: The vector store used for retrieving context documents.

    Returns:
        str: The combined content of the context documents relevant to the topic.
    """
    # Initialize the retriever from the vector store with similarity search
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 2})
    
    # Retrieve context documents that are most relevant to the provided topic
    context_documents = retriever.invoke(topic)
    
    # Combine the content of all retrieved documents into a single string
    context = "\n".join([doc.page_content for doc in context_documents])
    
    return context



def prepare_input_for_model(topic, context, num_questions):
    """
    Prepares a prompt for generating a quiz based on the given topic, context, and number of questions.

    Args:
        topic (str): The topic for which the quiz is to be created.
        context (str): The contextual information to base the quiz questions on.
        num_questions (int): The number of questions to generate for the quiz.

    Returns:
        str: The formatted prompt ready to be used with the model to generate the quiz.
    """
    # Define the prompt template for quiz generation
    prompt_template_for_quiz = ChatPromptTemplate.from_messages(
        [
            ("system", """You are a helpful assistant specialized in generating quizzes. When asked to create a quiz, provide a JSON response that includes a list of questions based on the given topic and number of questions requested. Each question should have four options labeled A, B, C, and D, and indicate the full correct answer not A,B,C or D. The JSON response should have the following format from which I can extract that JSON in frontend code and display it as a solvable quiz."""),
            ("human", """Create a quiz on the topic: {topic} with {num_questions} questions based on this {context}. Provide the questions and options in JSON format as described above."""),
        ]
    )

    # Print the prompt template for debugging purposes
    print("Prompt Template:", prompt_template_for_quiz)

    # Format the prompt with the provided topic, context, and number of questions
    prompt_for_quiz = prompt_template_for_quiz.format(
        topic=topic,
        context=context,
        num_questions=num_questions
    )

    # Print the formatted prompt for debugging purposes
    print("Formatted Prompt:", prompt_for_quiz)
    
    return prompt_for_quiz




def generate_quiz_response(prompt):
    """
    Generates a quiz based on the provided prompt using a language model.

    Args:
        prompt (str): The formatted prompt that specifies the quiz requirements.

    Returns:
        response: The generated quiz in response to the prompt.
    """
    # Initialize the language model with specific parameters
    llm = ChatGroq(
        temperature=0.5,  # Set the temperature for response variability
        model="llama-3.1-70b-versatile",  # Specify the model to use for generation
        api_key=api_key  # API key for authentication
    )
    
    # Generate the quiz content based on the provided prompt
    response = llm.invoke(prompt)
    
    return response


