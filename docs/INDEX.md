# 📚 Documentation Index

Welcome to the RAG Chatbot project! This guide will help you navigate all the documentation.

## 🚀 Getting Started (Read These First!)

1. **[OLLAMA_INSTALL.md](OLLAMA_INSTALL.md)** 📥 **START HERE!**

   - How to install Ollama on Windows/Linux/Mac
   - Model recommendations
   - Troubleshooting installation issues

2. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** ⭐
   - Overview of what was built
   - Quick statistics
   - Next steps to get running
3. **[QUICKSTART.md](QUICKSTART.md)** ⚡

   - 5-minute setup guide
   - Step-by-step instructions
   - Immediate action items

4. **[README.md](README.md)** 📖
   - Complete project documentation
   - Features and capabilities
   - Detailed setup instructions
   - API documentation

## 🔧 Running the Project

### Easy Start

```powershell
# Check your environment
.\check-env.ps1

# Start everything
.\start.ps1

# Open browser to http://localhost:3000
```

### Scripts Available

- **start.ps1** - Windows startup script (recommended)
- **start.sh** - Linux/Mac startup script
- **check-env.ps1** - Environment verification

## 📖 Documentation Files

### Core Documentation

- **[README.md](README.md)** - Main documentation (read this first!)
- **[QUICKSTART.md](QUICKSTART.md)** - Quick setup (5 minutes)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design & data flow
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues & solutions

### Reference Documentation

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What was built
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[LICENSE](LICENSE)** - MIT License

## 🏗️ Project Structure

```
capybara-v2/
│
├── 📁 backend/                    # FastAPI Backend
│   ├── app.py                    # Main API server
│   ├── rag.py                    # RAG logic
│   ├── ollama_client.py          # LLM client
│   ├── docs_loader.py            # Document processing
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Backend container
│
├── 📁 frontend/                   # React Frontend
│   ├── 📁 src/
│   │   ├── main.jsx              # Entry point
│   │   ├── App.jsx               # Root component
│   │   ├── Chat.jsx              # Chat UI
│   │   ├── Upload.jsx            # Upload UI
│   │   └── index.css             # Styles
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite config
│   ├── tailwind.config.js        # Tailwind config
│   ├── postcss.config.js         # PostCSS config
│   ├── index.html                # HTML template
│   └── Dockerfile                # Frontend container
│
├── 📁 data/                       # Your documents
│   └── sample-rag-intro.md       # Sample document
│
├── 📁 embeddings/                 # ChromaDB storage
│
└── 📄 Documentation Files (you are here!)
```

## 🎯 Quick Navigation by Task

### "I want to..."

#### ...get started quickly

➜ Read [QUICKSTART.md](QUICKSTART.md)

#### ...understand the architecture

➜ Read [ARCHITECTURE.md](ARCHITECTURE.md)

#### ...fix an issue

➜ Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

#### ...contribute to the project

➜ Read [CONTRIBUTING.md](CONTRIBUTING.md)

#### ...learn about the API

➜ Read [README.md](README.md) → API Endpoints section
➜ Visit http://localhost:8000/docs (when running)

#### ...deploy with Docker

➜ Read [README.md](README.md) → Docker Deployment section

#### ...customize the LLM model

➜ Edit `backend/ollama_client.py`
➜ Read [README.md](README.md) → Configuration section

#### ...change the UI

➜ Edit files in `frontend/src/`
➜ Read [CONTRIBUTING.md](CONTRIBUTING.md) → Frontend section

## 🆘 Common Questions

### Setup Questions

**Q: What do I need to install?**
A: Python 3.11+, Node.js 18+, and Ollama. Run `.\check-env.ps1` to verify.

**Q: How do I start the application?**
A: Run `.\start.ps1` (Windows) or `./start.sh` (Linux/Mac)

**Q: Which LLM model should I use?**
A: Start with `deepseek-r1` for advanced reasoning, `llama3:8b` for best balance, or `phi3:mini` for speed.

### Usage Questions

**Q: How do I upload documents?**
A: Go to http://localhost:3000, click "Upload Documents" tab, select your files.

**Q: What file formats are supported?**
A: PDF, TXT, and Markdown (.md) files.

**Q: How do I ask questions?**
A: Go to the "Chat" tab and type your question, then press Send.

### Technical Questions

**Q: Where is the data stored?**
A: Documents in `data/`, embeddings in `embeddings/` directory.

**Q: Can I use different embedding models?**
A: Yes, edit `backend/rag.py` to change the embedding function.

**Q: How do I change ports?**
A: Backend: edit `backend/app.py`, Frontend: edit `frontend/vite.config.js`

### Troubleshooting Questions

**Q: "Cannot connect to Ollama" error?**
A: Make sure Ollama is running: `ollama serve`

**Q: Port already in use?**
A: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) → Port Issues section

**Q: Dependencies not installing?**
A: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) → Backend/Frontend Issues

## 📊 Documentation Quick Stats

- **Total Documentation Files**: 10
- **Total Project Files**: 30+
- **Lines of Documentation**: 3,000+
- **Lines of Code**: 2,500+

## 🔗 External Resources

### Technologies Used

- [Ollama](https://ollama.com) - Local LLM runtime
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [React](https://react.dev/) - UI library
- [ChromaDB](https://www.trychroma.com/) - Vector database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

### Learning Resources

- [RAG Explained](https://www.google.com/search?q=what+is+RAG+AI)
- [Vector Databases](https://www.pinecone.io/learn/vector-database/)
- [Local LLMs](https://ollama.com/blog)

## 📝 Documentation Checklist

Before you start coding:

- [ ] Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- [ ] Follow [QUICKSTART.md](QUICKSTART.md)
- [ ] Verify with `.\check-env.ps1`
- [ ] Start with `.\start.ps1`
- [ ] Test at http://localhost:3000

Before asking for help:

- [ ] Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [ ] Review [README.md](README.md)
- [ ] Check terminal logs for errors
- [ ] Verify Ollama is running

Before contributing:

- [ ] Read [CONTRIBUTING.md](CONTRIBUTING.md)
- [ ] Understand [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] Test your changes
- [ ] Update relevant documentation

## 🎉 Ready to Start?

1. **First time?** → Read [QUICKSTART.md](QUICKSTART.md)
2. **Having issues?** → Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Want to learn more?** → Read [README.md](README.md)
4. **Want to contribute?** → Read [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Welcome to the RAG Chatbot project! Let's build something amazing! 🚀**
