# backend/docs_loader.py
"""
Document loader with support for PDF, TXT, and Markdown files.
Handles chunking of documents for better RAG performance.
"""
import os
from typing import List
from pypdf import PdfReader

def load_pdf(file_path: str) -> str:
    """Load and extract text from a PDF file."""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise Exception(f"Error loading PDF {file_path}: {str(e)}")

def load_text_file(file_path: str) -> str:
    """Load text from a TXT or MD file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        raise Exception(f"Error loading text file {file_path}: {str(e)}")

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """
    Split text into overlapping chunks.
    
    Args:
        text: The text to chunk
        chunk_size: Maximum size of each chunk in characters
        overlap: Number of characters to overlap between chunks
    
    Returns:
        List of text chunks
    """
    if not text or len(text) == 0:
        return []
    
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        # Get chunk
        end = start + chunk_size
        chunk = text[start:end]
        
        # Try to break at sentence boundary if possible
        if end < text_length:
            # Look for sentence endings
            for sep in ['. ', '.\n', '! ', '!\n', '? ', '?\n']:
                last_sep = chunk.rfind(sep)
                if last_sep > chunk_size * 0.7:  # Only if we're past 70% of chunk
                    chunk = chunk[:last_sep + 1]
                    end = start + last_sep + 1
                    break
        
        chunks.append(chunk.strip())
        
        # Move start position with overlap
        start = end - overlap
        if start >= text_length:
            break
    
    return [c for c in chunks if c]  # Filter empty chunks

def process_document(file_path: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """
    Process a document file and return chunks.
    
    Args:
        file_path: Path to the document
        chunk_size: Size of chunks in characters
        overlap: Overlap between chunks
    
    Returns:
        List of text chunks
    """
    file_ext = os.path.splitext(file_path)[1].lower()
    
    # Load document based on type
    if file_ext == '.pdf':
        text = load_pdf(file_path)
    elif file_ext in ['.txt', '.md']:
        text = load_text_file(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_ext}")
    
    # Clean and chunk text
    text = text.strip()
    if not text:
        raise ValueError(f"No text content found in {file_path}")
    
    chunks = chunk_text(text, chunk_size=chunk_size, overlap=overlap)
    
    return chunks

def load_directory(directory_path: str) -> dict:
    """
    Load all supported documents from a directory.
    
    Args:
        directory_path: Path to directory containing documents
    
    Returns:
        Dictionary mapping filenames to their chunks
    """
    if not os.path.exists(directory_path):
        return {}
    
    documents = {}
    supported_extensions = {'.pdf', '.txt', '.md'}
    
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        
        if os.path.isfile(file_path):
            file_ext = os.path.splitext(filename)[1].lower()
            if file_ext in supported_extensions:
                try:
                    chunks = process_document(file_path)
                    documents[filename] = chunks
                    print(f"Loaded {filename}: {len(chunks)} chunks")
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
    
    return documents
