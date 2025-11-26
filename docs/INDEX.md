# Documentation Index

Your guide to CapybaraGPT documentation.

## Start Here

**New users should read these in order:**

1. [QUICKSTART.md](../QUICKSTART.md) - Get running in 3 minutes
2. [README.md](../README.md) - Complete guide and features
3. [OLLAMA_INSTALL.md](OLLAMA_INSTALL.md) - Installing Ollama (if needed)

## All Documentation

### User Guides

- [README.md](../README.md) - Complete documentation
- [QUICKSTART.md](../QUICKSTART.md) - Fast setup
- [OLLAMA_INSTALL.md](OLLAMA_INSTALL.md) - Installing Ollama
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common problems

### Developer Guides

- [ARCHITECTURE.md](ARCHITECTURE.md) - How it works
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [CHANGELOG.md](CHANGELOG.md) - Version history

## Quick Commands

```powershell
# Check setup
.\check-env.ps1

# Start application
.\start.ps1

# Open in browser
http://localhost:3000
```

## Project Structure

```
capybara-gpt/
├── backend/          # Python API server
├── frontend/         # React web interface
├── data/             # Your documents
├── docs/             # Documentation
└── embeddings/       # Vector database
```

## Common Tasks

**Get started quickly**
→ [QUICKSTART.md](../QUICKSTART.md)

**Fix a problem**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Understand the system**
→ [ARCHITECTURE.md](ARCHITECTURE.md)

**Help improve the project**
→ [CONTRIBUTING.md](CONTRIBUTING.md)

**Change AI model**
→ Edit `backend/ollama_client.py` (MODEL_NAME = "gpt-oss:20b")

**View API documentation**
→ Visit http://localhost:8000/docs when running

## Frequently Asked Questions

**What do I need installed?**
Python 3.11+, Node.js 18+, and Ollama. Run `.\check-env.ps1` to check.

**How do I start it?**
Run `.\start.ps1` (Windows) or `./start.sh` (Linux/Mac)

**What's the default AI model?**
gpt-oss:20b (can be changed in `backend/ollama_client.py`)

**What file types work?**
PDF, TXT, and Markdown files.

**Where is my data stored?**
Documents: `data/` folder, Embeddings: `embeddings/` folder

**Ollama won't connect?**
Make sure Ollama is running: `ollama serve`

**Port already in use?**
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Resources

**Technologies:**

- [Ollama](https://ollama.com) - Runs AI models
- [FastAPI](https://fastapi.tiangolo.com/) - Python backend
- [React](https://react.dev/) - Web interface
- [ChromaDB](https://www.trychroma.com/) - Document search

---

**New here?** Start with [QUICKSTART.md](../QUICKSTART.md)
