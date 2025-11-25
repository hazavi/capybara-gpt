# Changelog

All notable changes to CapybaraGPT will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-11-25

### 🎨 Major UI Overhaul

#### Added

- **Modern Theme System**: OKLCH color space with CSS custom properties
- **ChatGPT-Style Sidebar**: Collapsible sidebar with icon-only mode (12px collapsed width)
- **Message Actions**: Copy, edit, and regenerate functionality for all messages
- **Stop Generation**: Interrupt AI responses mid-generation with stop button
- **Code Block Improvements**: Syntax highlighting with dedicated copy buttons
- **Memory Toggle**: Switch between temporary and saved chats (locks after first message)
- **Dark/Light Theme**: Complete theme system with smooth transitions
- **Model Selector**: Dropdown menu to switch models without restart
- **Chat Management**: Rename, delete, and organize conversations

#### Changed

- Sidebar now shows icons when collapsed instead of hiding completely
- Improved message bubble styling with better spacing and hover states
- Enhanced model dropdown with cleaner design
- Optimized chat history rendering performance

#### Fixed

- Code block hover conflicts with nested elements (using Tailwind group modifiers)
- White screen errors with improved error handling
- Cut-off AI responses (increased token limits)
- Model selector state persistence

### ⚡ Performance Improvements

#### Added

- **GPU Acceleration**: Automatic GPU detection and usage (`num_gpu: 1`)
- **Multi-threading**: Optimized CPU thread usage (`num_thread: 8`)
- **Context Optimization**: Reduced conversation history to last 2 messages for speed
- **Document Truncation**: Limited context chunks to 500 characters
- **Timeout Extension**: Increased to 300 seconds for large models

#### Changed

- `num_ctx`: 2048 (balanced speed/context)
- `max_tokens`: 2048 (complete responses)
- RAG retrieval: Limited to 2 document chunks
- Conversation history: Truncated to 150 characters per message

#### Documentation

- Added comprehensive performance tuning comments in `backend/ollama_client.py`
- Added RAG optimization comments in `backend/rag.py`
- Created performance tuning guide in README.md
- Added response time note to documentation

### 📚 Documentation Updates

#### Added

- Response time expectations and optimization guide
- Inline code comments for all performance parameters
- System prompt customization guide
- GitHub release template
- Updated CONTRIBUTING.md with recent features

#### Changed

- Reorganized README.md with performance section
- Enhanced QUICKSTART.md with timing expectations
- Updated all documentation to reflect current features

---

## [1.1.0] - 2024-XX-XX

### 🤖 Model Update

#### Changed

- **Default Model**: Updated from `llama3:8b` to `gpt-oss:20b`
- **Reasoning**: Better performance and response quality
- **Compatibility**: All previous models still supported

#### Documentation

- Updated all documentation with current model recommendations
- Added model comparison guide
- Updated troubleshooting for different model sizes

---

## [1.0.0] - 2024-XX-XX

### 🎉 Initial Release

Full-stack RAG chatbot with local LLM support, document analysis, and modern chat interface.

#### Core Features

##### Backend (FastAPI + Python)

- FastAPI REST API with CORS support
- RAG implementation with ChromaDB vector database
- Ollama client with streaming response support
- Document processing (PDF, TXT, Markdown)
- Semantic search and retrieval
- Health check endpoints

##### Frontend (React + Vite)

- ChatGPT-inspired interface
- Real-time streaming responses
- Document upload with drag-and-drop
- Chat history management
- Responsive design with Tailwind CSS
- Dark theme support

##### Document Intelligence

- Multi-format support (PDF, TXT, MD)
- Automatic text chunking with overlap
- Vector embeddings with sentence-transformers
- Semantic search with ChromaDB
- Context-aware responses

##### Developer Experience

- Cross-platform startup scripts (PowerShell & Bash)
- Environment verification script
- Docker Compose support
- Comprehensive documentation
- API documentation (FastAPI auto-generated)

#### Technical Stack

**Backend:**

- FastAPI 0.100+
- ChromaDB (vector database)
- Sentence-Transformers (embeddings)
- PyPDF2 (PDF processing)
- Uvicorn (ASGI server)

**Frontend:**

- React 18
- Vite (build tool)
- Tailwind CSS
- Marked (Markdown rendering)

**AI/ML:**

- Ollama (LLM runtime)
- Multiple model support (Llama, Mistral, Phi3, etc.)
- Streaming response generation

#### Project Structure

```
capybara-v2/
├── backend/           # Python FastAPI server
│   ├── app.py        # API routes and endpoints
│   ├── rag.py        # RAG logic and ChromaDB
│   ├── ollama_client.py  # LLM client
│   └── docs_loader.py    # Document processing
├── frontend/          # React application
│   ├── src/
│   │   ├── App.jsx   # Main component
│   │   ├── Chat.jsx  # Chat interface
│   │   └── Upload.jsx # Document upload
│   └── public/
├── data/             # Document storage
├── docs/             # Documentation
├── embeddings/       # ChromaDB storage
└── start.ps1         # Startup script
```

#### Privacy & Security

- 100% local processing
- No external API calls (after setup)
- No data collection or tracking
- Complete conversation privacy
- Offline-capable operation

#### Requirements

- Python 3.11+
- Node.js 18+
- Ollama runtime
- 8GB+ RAM recommended
- GPU optional (speeds up inference)

---

## Release Notes Format

### Version Format

- **Major**: Breaking changes or significant architecture updates
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, performance improvements

### Categories

- 🎨 **UI/UX**: Interface and design changes
- ⚡ **Performance**: Speed and optimization improvements
- 🔧 **Backend**: Server-side changes
- ⚛️ **Frontend**: Client-side changes
- 📚 **Documentation**: Docs and guides
- 🐛 **Bug Fixes**: Error corrections
- 🔒 **Security**: Security improvements
- 🤖 **Models**: AI model updates

---

**Built with ❤️ for privacy-conscious AI enthusiasts**
