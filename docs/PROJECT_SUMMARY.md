# Project Summary

CapybaraGPT is a complete AI assistant that runs on your computer.

## What's Included

### Backend (Python + FastAPI)

- `app.py` - Main API server
- `rag.py` - Document search system
- `ollama_client.py` - AI model connection
- `docs_loader.py` - Document processing
- `requirements.txt` - Python packages
- `Dockerfile` - Container setup

### Frontend (React)

- `src/App.jsx` - Main application
- `src/Chat.jsx` - Chat interface
- `src/Upload.jsx` - File upload
- `src/main.jsx` - App entry point
- `src/index.css` - Styling
- `package.json` - Dependencies
- `vite.config.js` - Build setup
- `index.html` - Web page

### Scripts & Docs

- `README.md` - Main guide
- `QUICKSTART.md` - Fast setup
- `start.ps1` - Windows startup
- `start.sh` - Linux/Mac startup
- `check-env.ps1` - System check
- `docker-compose.yml` - Docker setup

## Getting Started

```powershell
# 1. Install Ollama from https://ollama.com
ollama pull gpt-oss:20b

# 2. Check your system
.\check-env.ps1

# 3. Start the app
.\start.ps1

# 4. Open in browser
http://localhost:3000
```

## Features

- Chat interface with AI
- Upload and search documents (PDF, TXT, Markdown)
- Everything runs locally
- API available at http://localhost:8000/docs
- Works on Windows, Linux, and Mac
- Docker support included

## Technical Details

**Languages:** Python, JavaScript, CSS  
**Frontend:** React + Tailwind CSS  
**Backend:** FastAPI + Python  
**Database:** ChromaDB (vector search)  
**AI Model:** gpt-oss:20b (default)  
**Total Files:** 24+  
**Lines of Code:** ~2,500+

- **LLM Support**: Ollama (LLaMA, Phi, Mistral, etc.)

## 🔗 Quick Links

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Ollama: http://localhost:11434

## 📖 Documentation

1. **README.md** - Full project documentation
2. **QUICKSTART.md** - Quick setup guide
3. **CHANGELOG.md** - What was built

## 🎉 You're Ready!

Your RAG Chatbot is ready to use. Start by:

1. Uploading some documents
2. Asking questions about them
3. Enjoying your private AI assistant!

---

**Questions?** Check the README.md or QUICKSTART.md
