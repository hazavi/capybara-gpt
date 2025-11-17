# 🦙 RAG Chatbot - Local LLM with Document Knowledge

A full-stack RAG (Retrieval Augmented Generation) chatbot that runs entirely locally using Ollama, ChromaDB, FastAPI, and React. Upload your documents and chat with them using a local LLM!

## 🌟 Features

- **100% Local**: All processing happens on your machine
- **Modern UI**: ChatGPT-style interface built with React + Tailwind CSS
- **Document Upload**: Support for PDF, TXT, and Markdown files
- **Smart Chunking**: Automatic document chunking for optimal retrieval
- **Vector Search**: ChromaDB for fast semantic search
- **Multiple LLMs**: Support for any Ollama model (LLaMA, Phi, Mistral, etc.)
- **REST API**: FastAPI backend with full CRUD operations

## 📁 Project Structure

```
rag-chatbot/
├── backend/
│   ├── app.py              # FastAPI server
│   ├── rag.py              # RAG logic with ChromaDB
│   ├── ollama_client.py    # Ollama HTTP client
│   ├── docs_loader.py      # Document processing & chunking
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend containerization
├── frontend/
│   ├── src/
│   │   ├── main.jsx        # React entry point
│   │   ├── App.jsx         # Main app component
│   │   ├── Chat.jsx        # Chat interface
│   │   ├── Upload.jsx      # Document upload UI
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node dependencies
│   ├── vite.config.js      # Vite configuration
│   └── index.html          # HTML template
├── data/                   # Your documents go here
├── embeddings/             # ChromaDB persistent storage
└── README.md
```

## 🚀 Quick Start

### Prerequisites

1. **Python 3.11+** installed
2. **Node.js 18+** and npm installed
3. **Ollama** installed and running

### Step 1: Install and Start Ollama

Download Ollama from [https://ollama.com](https://ollama.com)

Pull a model (choose one):

```bash
# Recommended models:
ollama pull deepseek-r1    # Advanced reasoning model (recommended)
ollama pull llama3:8b      # Good balance of speed and quality
ollama pull phi3:mini      # Fast and lightweight
ollama pull mistral        # Alternative option
```

Start Ollama server:

```bash
ollama serve
```

Ollama runs at `http://localhost:11434` by default.

### Step 2: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python app.py
```

Backend will run at `http://localhost:8000`

### Step 3: Set Up Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run at `http://localhost:3000`

### Step 4: Use the Application

1. Open your browser to `http://localhost:3000`
2. Go to the **"Upload Documents"** tab
3. Upload some PDF, TXT, or MD files
4. Switch to the **"Chat"** tab
5. Ask questions about your documents!

## 🔧 Configuration

### Change the LLM Model

Edit `backend/ollama_client.py`:

```python
MODEL_NAME = "deepseek-r1"  # Change to your preferred model
```

### Adjust Chunking Parameters

Edit `backend/docs_loader.py`:

```python
chunk_size = 1000  # Characters per chunk
overlap = 200      # Overlap between chunks
```

### Backend Port

Edit `backend/app.py`:

```python
uvicorn.run(app, host="0.0.0.0", port=8000)  # Change port here
```

### Frontend Port

Edit `frontend/vite.config.js`:

```javascript
server: {
  port: 3000,  // Change port here
}
```

## 📚 API Endpoints

### POST `/ask`

Ask a question with RAG context

**Request:**

```json
{
  "text": "What is the main topic of the documents?",
  "stream": false
}
```

**Response:**

```json
{
  "answer": "Based on the documents..."
}
```

### POST `/upload`

Upload a document (multipart/form-data)

**Response:**

```json
{
  "message": "Document 'example.pdf' uploaded successfully",
  "chunks": 15
}
```

### GET `/documents`

Get knowledge base statistics

**Response:**

```json
{
  "total_chunks": 45,
  "total_documents": 3,
  "documents": ["doc1.pdf", "doc2.txt", "doc3.md"]
}
```

### DELETE `/documents`

Clear all documents from knowledge base

## 🐳 Docker Deployment (Optional)

### Build Backend Container

```bash
cd backend
docker build -t rag-chatbot-backend .
docker run -p 8000:8000 -v $(pwd)/../embeddings:/app/embeddings rag-chatbot-backend
```

### Build Frontend Container

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
```

Build and run:

```bash
cd frontend
docker build -t rag-chatbot-frontend .
docker run -p 3000:3000 rag-chatbot-frontend
```

## 🛠️ Development

### Backend Development

The backend uses:

- **FastAPI**: Modern Python web framework
- **ChromaDB**: Vector database for embeddings
- **sentence-transformers**: Default embedding model (all-MiniLM-L6-v2)
- **pypdf**: PDF text extraction

### Frontend Development

The frontend uses:

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

Hot reload is enabled for both frontend and backend during development.

## 📖 How It Works

1. **Document Upload**: User uploads PDF/TXT/MD files via the UI
2. **Chunking**: Documents are split into overlapping chunks (1000 chars with 200 overlap)
3. **Embedding**: Each chunk is embedded using sentence-transformers (all-MiniLM-L6-v2)
4. **Storage**: Embeddings stored in ChromaDB (persistent on disk)
5. **Query**: User asks a question
6. **Retrieval**: Top 3 most relevant chunks retrieved using semantic search
7. **Generation**: Context + question sent to local LLM (Ollama)
8. **Response**: AI-generated answer displayed in chat

## 🎯 Use Cases

- **Personal Knowledge Base**: Chat with your notes, papers, and documents
- **Document Q&A**: Ask questions about technical documentation
- **Research Assistant**: Query research papers and articles
- **Learning Tool**: Interactive way to study textbooks and materials
- **Privacy-First**: All data stays on your machine

## 🐛 Troubleshooting

### "Error communicating with Ollama"

- Make sure Ollama is running: `ollama serve`
- Check if the model is pulled: `ollama list` (ensure `deepseek-r1` is listed)
- Verify Ollama is at `http://localhost:11434`

### "No response from backend"

- Ensure backend is running on port 8000
- Check backend logs for errors
- Verify Python dependencies are installed

### "Upload fails"

- Check file format (PDF, TXT, or MD only)
- Ensure file is not corrupted
- Check backend logs for details

### ChromaDB errors

- Delete the `embeddings/` directory and restart
- Reinstall chromadb: `pip install --upgrade chromadb`

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Streaming responses in the UI
- [ ] Multiple document format support (DOCX, etc.)
- [ ] Chat history persistence
- [ ] Advanced search filters
- [ ] Multi-language support
- [ ] Conversation context memory

## 📝 License

MIT License - feel free to use this project however you like!

## 🙏 Acknowledgments

- [Ollama](https://ollama.com) - Local LLM runtime
- [ChromaDB](https://www.trychroma.com/) - Vector database
- [FastAPI](https://fastapi.tiangolo.com/) - Web framework
- [Sentence Transformers](https://www.sbert.net/) - Embeddings

---

**Made with ❤️ for the local AI community**

Need help? Open an issue or check the troubleshooting section!
