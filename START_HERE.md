# Welcome to CapybaraGPT

**Your private AI assistant that runs on your computer.**

## New Here? Start with These:

1. **[QUICKSTART.md](QUICKSTART.md)** - Get running in 3 minutes
2. **[README.md](README.md)** - Full documentation and features

## What is This?

CapybaraGPT is a local AI assistant for:

- Conversations and Q&A
- Document analysis (PDF, TXT, Markdown)
- Code help and debugging
- Complete privacy (everything stays on your machine)

---

## Documentation Map

### Getting Started

- [QUICKSTART.md](QUICKSTART.md) - Fast 3-step setup
- [README.md](README.md) - Complete guide
- [docs/OLLAMA_INSTALL.md](docs/OLLAMA_INSTALL.md) - Detailed Ollama installation

### Using the App

- **Switch Models** - Dropdown next to send button
- **Settings** - Click ⚙️ icon in sidebar
- **Upload Docs** - Click + button to add files
- **API Docs** - Visit http://localhost:8000/docs when running

### Troubleshooting

- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Common fixes
- Run `.\check-env.ps1` to check your setup
- Visit [ollama.com/library](https://ollama.com/library) for models

### Developers

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) - How to contribute
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - Version history

---

## Project Structure

```
capybara-gpt/
├── backend/          # Python API server
├── frontend/         # React web UI
├── data/             # Uploaded documents
├── docs/             # Documentation
├── embeddings/       # Vector database
└── start.ps1         # Launch script
```

**Configuration Files:**

- `backend/ollama_client.py` - Model settings (🎯 markers)
- `backend/rag.py` - Document search (⚡ markers)

---

**Ready to start?** → [QUICKSTART.md](QUICKSTART.md)
