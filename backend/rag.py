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

def retrieve_context(query: str, n_results: int = 2) -> str:
    """
    Retrieve relevant context from the knowledge base.
    
    Args:
        query: The query to search for
        n_results: Number of results to retrieve
    
    Returns:
        Concatenated context string
    """
    # ========================================
    # ⚡ RAG PERFORMANCE TUNING
    # ========================================
    # 🎯 n_results: Number of document chunks to retrieve
    #    Lower = faster but less context, Higher = slower but more complete
    #    Default: 2 (good for most queries)
    #    Try: 1 for speed, 3-5 for complex questions
    
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
        
        # 🎯 doc_truncated: Truncate each document chunk
        #    Lower = faster processing, Higher = more context per chunk
        #    Default: 500 characters (balanced)
        #    Try: 300 for speed, 1000 for detailed context
        context_parts = []
        for i, (doc, meta) in enumerate(zip(docs, metadatas)):
            source = meta.get("source", "unknown") if meta else "unknown"
            doc_truncated = doc[:500] + "..." if len(doc) > 500 else doc
            context_parts.append(f"[Source: {source}]\n{doc_truncated}")
        
        return "\n\n".join(context_parts)
    except Exception as e:
        print(f"Error retrieving context: {e}")
        return ""

def ask_rag(question: str, stream: bool = False, history: list = None, personalization: str = '', model: str = ''):
    """
    Ask a question using RAG (Retrieval Augmented Generation).
    
    Args:
        question: The question to ask
        stream: Whether to stream the response
        history: Previous conversation messages for context
        personalization: User's personalization preferences
        model: Model name to use for generation
    
    Returns:
        If stream=False: Complete answer string
        If stream=True: Generator yielding answer chunks
    """
    # Retrieve relevant context from documents
    context = retrieve_context(question)
    
    # ========================================
    # ⚡ CONVERSATION HISTORY TUNING FOR FASTER RESPONSES
    # ========================================
    # 🎯 history[-2:]: Number of previous messages to include
    #    Lower = faster but less conversational context
    #    Higher = slower but AI remembers more of the conversation
    #    Default: last 2 messages (1 user + 1 assistant exchange)
    #    Try: history[-1:] for fastest, history[-4:] for better context
    
    conversation_context = ""
    if history:
        conversation_context = "Previous conversation:\n"
        for msg in history[-2:]:
            role = "User" if msg.get("role") == "user" else "Assistant"
            content = msg.get("content", "")
            
            # 🎯 Truncate long messages: Limit character count per message
            #    Lower = faster processing, Higher = more context
            #    Default: 150 characters (good for speed)
            #    Try: 100 for faster, 300 for more context
            if len(content) > 150:
                content = content[:150] + "..."
            conversation_context += f"{role}: {content}\n"
        conversation_context += "\n"
    
    # ========================================
    # 🎯 SYSTEM PROMPT CUSTOMIZATION
    # ========================================
    # Edit the system prompt below to change AI personality and behavior
    # Shorter prompts = faster responses, Detailed prompts = more specific behavior
    
    system_prompt = None
    if conversation_context or context or personalization:
        system_parts = [
            # 🎯 Default AI personality - Edit this to change behavior!
            "You are a helpful AI assistant. Provide complete, well-structured answers.",
            "Always finish your thoughts completely - do not cut off mid-sentence."
            # Examples to try:
            # "You are a coding expert. Provide concise, practical solutions."
            # "You are a friendly tutor. Explain concepts clearly with examples."
            # "You are a research assistant. Provide detailed, factual answers."
        ]
        if personalization:
            system_parts.append(personalization)
        if conversation_context:
            system_parts.append(conversation_context)
        if context:
            system_parts.append(f"Relevant document context:\n{context}")
        system_prompt = "\n\n".join(system_parts)
    else:
        # 🎯 Default system prompt when no context - Edit to change default behavior!
        system_prompt = "You are a helpful AI assistant. Provide complete, well-structured answers. Always finish your thoughts completely - do not cut off mid-sentence."
    
    # Build the current question prompt
    prompt = f"{question}"
    
    # Get response from LLM
    if stream:
        # Return generator for streaming
        return ask_ollama(prompt, stream=True, system=system_prompt, model_name=model)
    else:
        # Non-streaming call - ask_ollama is synchronous
        try:
            return ask_ollama(prompt, stream=False, system=system_prompt, model_name=model)
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
