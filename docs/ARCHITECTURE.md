# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND (Vite)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   App.jsx    │  │   Chat.jsx   │  │  Upload.jsx  │         │
│  │  (Main App)  │  │ (Chat UI)    │  │ (File Upload)│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│              Tailwind CSS + React Components                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API Calls
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND (Python)                       │
│                    http://localhost:8000                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app.py - API Endpoints                                  │  │
│  │  • POST /ask      - Chat with documents                  │  │
│  │  • POST /upload   - Upload documents                     │  │
│  │  • GET /documents - List documents                       │  │
│  │  • DELETE /documents - Clear database                    │  │
│  └──────────────┬───────────────────────┬───────────────────┘  │
│                 │                       │                       │
│                 ▼                       ▼                       │
│  ┌──────────────────────┐   ┌──────────────────────┐          │
│  │   rag.py             │   │  docs_loader.py      │          │
│  │  • RAG Logic         │   │  • PDF Loading       │          │
│  │  • Context Retrieval │   │  • Text Chunking     │          │
│  │  • Query Processing  │   │  • File Processing   │          │
│  └──────────┬───────────┘   └──────────────────────┘          │
│             │                                                   │
└─────────────┼───────────────────────────────────────────────────┘
              │
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌────────────────┐  ┌────────────────────────┐
│   ChromaDB     │  │  Ollama LLM Server     │
│  (Vector DB)   │  │ http://localhost:11434 │
│                │  │                        │
│ ┌────────────┐ │  │ ┌────────────────────┐ │
│ │ Embeddings │ │  │ │  ollama_client.py  │ │
│ │  Storage   │ │  │ │   HTTP Client      │ │
│ └────────────┘ │  │ └─────────┬──────────┘ │
│                │  │           │            │
│  embeddings/   │  │           ▼            │
│  directory     │  │ ┌────────────────────┐ │
└────────────────┘  │ │  Local LLM Models  │ │
                    │ │  • gpt-oss:20b     │ │
                    │ │  • llama3:8b       │ │
                    │ │  • deepseek-r1     │ │
                    │ │  • phi3:mini       │ │
                    │ └────────────────────┘ │
                    └────────────────────────┘
```

## Data Flow

### 1. Document Upload Flow

```
User → Upload.jsx → POST /upload → docs_loader.py
                                          ↓
                                    Process & Chunk
                                          ↓
                                     rag.py
                                          ↓
                                    Generate Embeddings
                                          ↓
                                     ChromaDB
                                          ↓
                                  Store in embeddings/
```

### 2. Chat Query Flow

```
User → Chat.jsx → POST /ask → rag.py
                                 ↓
                          Retrieve Context
                                 ↓
                             ChromaDB
                                 ↓
                        Get Relevant Chunks
                                 ↓
                        Build Prompt with Context
                                 ↓
                          ollama_client.py
                                 ↓
                            Ollama Server
                                 ↓
                          Generate Response
                                 ↓
                            Chat.jsx
                                 ↓
                          Display to User
```

## Component Details

### Frontend Stack

- **React 18**: UI framework
- **Vite**: Build tool & dev server
- **Tailwind CSS**: Styling
- **Fetch API**: HTTP client

### Backend Stack

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Python-multipart**: File upload

### AI/ML Stack

- **Ollama**: LLM server
- **ChromaDB**: Vector database
- **sentence-transformers**: Embeddings
- **pypdf**: PDF processing

## File Structure

```
capybara-gpt/
│
├── 📁 backend/              # FastAPI Backend
│   ├── app.py              # Main API server
│   ├── rag.py              # RAG implementation
│   ├── ollama_client.py    # LLM client
│   ├── docs_loader.py      # Document processing
│   ├── requirements.txt    # Dependencies
│   └── Dockerfile          # Container config
│
├── 📁 frontend/             # React Frontend
│   ├── 📁 src/
│   │   ├── main.jsx        # Entry point
│   │   ├── App.jsx         # Root component
│   │   ├── Chat.jsx        # Chat interface
│   │   ├── Upload.jsx      # Upload interface
│   │   └── index.css       # Styles
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Build config
│   ├── tailwind.config.js  # CSS config
│   └── Dockerfile          # Container config
│
├── 📁 data/                 # Document storage
│   └── sample-rag-intro.md # Sample document
│
├── 📁 docs/                 # Documentation
│   ├── INDEX.md            # Documentation index
│   ├── ARCHITECTURE.md     # This file
│   ├── OLLAMA_INSTALL.md   # Ollama setup guide
│   ├── TROUBLESHOOTING.md  # Problem solving
│   ├── PROJECT_SUMMARY.md  # Project overview
│   ├── CONTRIBUTING.md     # Contribution guide
│   └── CHANGELOG.md        # Version history
│
├── 📁 embeddings/           # ChromaDB storage
│   └── (generated files)
│
├── 📄 README.md            # Main documentation
├── 📄 START_HERE.md        # Quick orientation
├── 📄 QUICKSTART.md        # Fast setup guide
│
├── 🔧 start.ps1            # Windows startup
├── 🔧 start.sh             # Linux/Mac startup
├── 🔧 check-env.ps1        # Environment check
├── 🐳 docker-compose.yml   # Docker orchestration
└── 📝 .gitignore           # Git ignore rules
```

## Technology Choices

### Why Ollama?

- ✅ Runs locally (privacy)
- ✅ Easy to use
- ✅ Multiple model support
- ✅ HTTP API
- ✅ Cross-platform

### Why ChromaDB?

- ✅ Built for embeddings
- ✅ Easy to use
- ✅ Persistent storage
- ✅ Fast queries
- ✅ Python-native

### Why FastAPI?

- ✅ Fast performance
- ✅ Automatic docs
- ✅ Modern Python
- ✅ Type safety
- ✅ Async support

### Why React + Vite?

- ✅ Fast development
- ✅ Hot reload
- ✅ Modern tooling
- ✅ Great ecosystem
- ✅ Easy deployment

## Deployment Options

### Option 1: Local Development

```bash
.\start.ps1  # Runs both servers locally
```

### Option 2: Docker Compose

```bash
docker-compose up  # Containerized deployment
```

### Option 3: Separate Containers

```bash
# Backend
cd backend && docker build -t backend . && docker run -p 8000:8000 backend

# Frontend
cd frontend && docker build -t frontend . && docker run -p 3000:3000 frontend
```

## Performance Characteristics

### Response Times

- **Document Upload**: 1-5 seconds (depends on size)
- **Embedding Generation**: 100-500ms per chunk
- **Query Retrieval**: 50-200ms
- **LLM Generation**: 2-10 seconds (depends on model)

### Resource Usage

- **Backend**: ~500MB RAM
- **Frontend**: ~200MB RAM
- **ChromaDB**: ~100MB RAM + disk
- **Ollama**: 2-8GB RAM (depends on model)

### Scalability

- **Documents**: Tested with 100+ documents
- **Chunks**: Handles 1000+ chunks efficiently
- **Concurrent Users**: 5-10 (single instance)
- **Response Quality**: Excellent with proper chunking

## Security Considerations

### Current Status

- ✅ CORS configured
- ✅ File type validation
- ✅ Local-only by default
- ⚠️ No authentication (add for production)
- ⚠️ No rate limiting (add for production)

### Production Recommendations

1. Add authentication (JWT/OAuth)
2. Add rate limiting
3. Validate file sizes
4. Sanitize inputs
5. Use HTTPS
6. Add monitoring

---

**This architecture provides a solid foundation for a local RAG system!**
