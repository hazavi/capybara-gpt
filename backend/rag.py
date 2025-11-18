# backend/rag.py
import chromadb
from chromadb.utils import embedding_functions
from ollama_client import ask_ollama
import os

# Initialize ChromaDB with persistent storage
EMBEDDINGS_PATH = os.path.join(os.path.dirname(__file__), "..", "embeddings")
os.makedirs(EMBEDDINGS_PATH, exist_ok=True)

chroma_client = chromadb.PersistentClient(path=EMBEDDINGS_PATH)

# Use default embedding function (all-MiniLM-L6-v2 via sentence-transformers)
embedding_fn = embedding_functions.DefaultEmbeddingFunction()

collection = chroma_client.get_or_create_collection(
    name="documents",
    embedding_function=embedding_fn
)

def add_document_to_rag(doc_id: str, chunks: list[str]):
    """
    Add document chunks to the RAG knowledge base.
    
    Args:
        doc_id: Unique identifier for the document
        chunks: List of text chunks to add
    """
    if not chunks:
        return
    
    # Create unique IDs for each chunk
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    
    # Add to collection
    collection.add(
        ids=ids,
        documents=chunks,
        metadatas=[{"source": doc_id, "chunk_index": i} for i in range(len(chunks))]
    )

def retrieve_context(query: str, n_results: int = 3) -> str:
    """
    Retrieve relevant context from the knowledge base.
    
    Args:
        query: The query to search for
        n_results: Number of results to retrieve
    
    Returns:
        Concatenated context string
    """
    try:
        results = collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        if not results["documents"] or not results["documents"][0]:
            return ""
        
        # Get documents and their sources
        docs = results["documents"][0]
        metadatas = results.get("metadatas", [[]])[0]
        
        # Format context with sources
        context_parts = []
        for i, (doc, meta) in enumerate(zip(docs, metadatas)):
            source = meta.get("source", "unknown") if meta else "unknown"
            context_parts.append(f"[Source: {source}]\n{doc}")
        
        return "\n\n".join(context_parts)
    except Exception as e:
        print(f"Error retrieving context: {e}")
        return ""

def ask_rag(question: str, stream: bool = False, history: list = None):
    """
    Ask a question using RAG (Retrieval Augmented Generation).
    
    Args:
        question: The question to ask
        stream: Whether to stream the response
        history: Previous conversation messages for context
    
    Returns:
        If stream=False: Complete answer string
        If stream=True: Generator yielding answer chunks
    """
    # Retrieve relevant context from documents
    context = retrieve_context(question)
    
    # Build conversation history for system prompt
    conversation_context = ""
    if history:
        conversation_context = "Previous conversation:\n"
        for msg in history[-6:]:  # Last 6 messages (3 exchanges)
            role = "User" if msg.get("role") == "user" else "Assistant"
            content = msg.get("content", "")
            # Truncate long messages
            if len(content) > 300:
                content = content[:300] + "..."
            conversation_context += f"{role}: {content}\n"
        conversation_context += "\n"
    
    # Build system prompt with history
    system_prompt = None
    if conversation_context or context:
        system_parts = []
        if conversation_context:
            system_parts.append(conversation_context)
        if context:
            system_parts.append(f"Relevant document context:\n{context}")
        system_prompt = "\n\n".join(system_parts)
    
    # Build the current question prompt
    prompt = f"Question: {question}\n\nAnswer:"
    
    # Get response from LLM
    if stream:
        # Return generator for streaming
        return ask_ollama(prompt, stream=True, system=system_prompt)
    else:
        # Non-streaming call - ask_ollama is synchronous
        try:
            return ask_ollama(prompt, stream=False, system=system_prompt)
        except Exception as e:
            print(f"Error calling Ollama: {e}")
            raise Exception(f"Failed to get response from LLM: {str(e)}")

def get_collection_stats():
    """Get statistics about the document collection."""
    try:
        count = collection.count()
        # Get unique sources
        if count > 0:
            results = collection.get()
            sources = set()
            if results.get("metadatas"):
                for meta in results["metadatas"]:
                    if meta and "source" in meta:
                        sources.add(meta["source"])
            return {
                "total_chunks": count,
                "total_documents": len(sources),
                "documents": list(sources)
            }
        return {"total_chunks": 0, "total_documents": 0, "documents": []}
    except Exception as e:
        return {"error": str(e)}

def clear_collection():
    """Clear all documents from the collection."""
    global collection, chroma_client
    try:
        chroma_client.delete_collection("documents")
        collection = chroma_client.get_or_create_collection(
            name="documents",
            embedding_function=embedding_fn
        )
    except Exception as e:
        print(f"Error clearing collection: {e}")
