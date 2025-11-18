# Changelog

## Version 1.1.0 - DeepSeek-R1 Integration

### 🤖 Model Update

- **Updated default LLM**: Changed from `llama3:8b` to `deepseek-r1`
- **Reasoning capabilities**: DeepSeek-R1 offers advanced reasoning and problem-solving
- **Documentation updates**: All docs now reference `deepseek-r1` as the recommended model
- **Backward compatible**: Other models (llama3:8b, phi3:mini, mistral) still supported

### 📝 Documentation Updates

- Updated README.md with DeepSeek-R1 as primary recommendation
- Updated QUICKSTART.md installation instructions
- Updated TROUBLESHOOTING.md examples
- Updated ARCHITECTURE.md model listings
- Updated all configuration examples

## Version 1.0.0 - Initial Release

### 🎉 Project Created

Full-stack RAG Chatbot with local LLM support, document upload, and modern UI.

### 🔧 Backend (FastAPI)

- **app.py**: FastAPI server with CORS, file upload, chat endpoint
- **rag.py**: RAG logic with ChromaDB integration
- **ollama_client.py**: HTTP client for Ollama with streaming support
- **docs_loader.py**: Document processing with chunking for PDF, TXT, MD
- **requirements.txt**: Python dependencies
- **Dockerfile**: Backend containerization

### ⚛️ Frontend (React + Vite)

- **App.jsx**: Main application with tab navigation
- **Chat.jsx**: ChatGPT-style chat interface
- **Upload.jsx**: Document upload UI with knowledge base management
- **main.jsx**: React entry point
- **index.css**: Tailwind CSS styles with custom animations
- **package.json**: Node.js dependencies
- **vite.config.js**: Vite configuration with proxy
- **tailwind.config.js**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS configuration
- **index.html**: HTML template
- **Dockerfile**: Frontend containerization

### 📚 Documentation

- **README.md**: Comprehensive project documentation
- **QUICKSTART.md**: 5-minute setup guide
- **sample-rag-intro.md**: Sample document for testing

### 🛠️ Utilities

- **start.ps1**: Windows PowerShell startup script
- **start.sh**: Linux/Mac bash startup script
- **check-env.ps1**: Environment verification script
- **docker-compose.yml**: Docker Compose configuration
- **.gitignore**: Git ignore rules

### 📁 Directory Structure

```
rag-chatbot/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── data/            # Document storage
└── embeddings/      # ChromaDB vector store
```

### ✨ Features

- Local LLM support via Ollama
- Document upload (PDF, TXT, MD)
- Semantic search with ChromaDB
- ChatGPT-style UI
- Real-time chat
- Knowledge base management
- Docker support
- Cross-platform scripts

### 🔒 Privacy

- 100% local processing
- No data sent to external servers
- Offline-capable (after initial setup)

---

**Built with ❤️ for the local AI community**
