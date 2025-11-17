# backend/app.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os
import shutil
from rag import ask_rag, add_document_to_rag
from docs_loader import process_document

app = FastAPI(title="RAG Chatbot API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    text: str
    stream: bool = False

@app.get("/")
def root():
    return {"message": "RAG Chatbot API is running"}

@app.post("/ask")
def ask(q: Question):
    """Ask a question and get an answer based on RAG context."""
    try:
        print(f"Received question: {q.text}, stream: {q.stream}")
        if q.stream:
            # Return streaming response
            def generate():
                for chunk in ask_rag(q.text, stream=True):
                    yield f"data: {chunk}\n\n"
                yield "data: [DONE]\n\n"
            
            return StreamingResponse(generate(), media_type="text/event-stream")
        else:
            # Return complete answer
            print("Getting answer from RAG...")
            answer = ask_rag(q.text, stream=False)
            print(f"Answer received: {answer[:100]}...")
            return {"answer": answer}
    except Exception as e:
        print(f"Error in /ask endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a document (PDF, TXT, MD) to add to the knowledge base."""
    try:
        # Check file extension
        allowed_extensions = {".pdf", ".txt", ".md"}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file_ext} not supported. Allowed: {allowed_extensions}"
            )
        
        # Save uploaded file to data directory
        data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        os.makedirs(data_dir, exist_ok=True)
        
        file_path = os.path.join(data_dir, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process and add to RAG
        chunks = process_document(file_path)
        add_document_to_rag(file.filename, chunks)
        
        return {
            "message": f"Document '{file.filename}' uploaded and processed successfully",
            "chunks": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
def list_documents():
    """List all documents in the knowledge base."""
    from rag import get_collection_stats
    stats = get_collection_stats()
    return stats

@app.delete("/documents")
def clear_documents():
    """Clear all documents from the knowledge base."""
    from rag import clear_collection
    clear_collection()
    return {"message": "All documents cleared from knowledge base"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
