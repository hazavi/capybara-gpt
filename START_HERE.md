# 📖 Start Here!

Welcome! This is a **RAG Chatbot** - upload your documents and chat with them using AI that runs 100% locally on your computer.

## 🎯 What You Need to Know

**New to this project?** Just run these 3 commands:

```powershell
# 1. Install Ollama from https://ollama.com, then:
ollama pull llama3.1
ollama serve

# 2. Start everything (in a new terminal)
.\start.ps1

# 3. Open http://localhost:3000 in your browser
```

That's it! Click the **+** button to upload a document and start chatting.

---

## 📚 Documentation

### Essential Docs (Read These!)

- **[README.md](README.md)** ⭐ - Main guide (start here)
- **[QUICKSTART.md](QUICKSTART.md)** ⚡ - 3-minute setup

### When You Need Help

- **[docs/OLLAMA_INSTALL.md](docs/OLLAMA_INSTALL.md)** - Detailed Ollama installation
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Fix common problems

### For Developers

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - How it works
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Help improve the project
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Version history

---

## 💡 Quick Tips

- **Check your setup**: Run `.\check-env.ps1`
- **View API docs**: Visit http://localhost:8000/docs when running
- **Try different models**: See https://ollama.com/search
- **Having issues?** Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 🗂️ Project Structure

```
capybara-v2/
├── backend/          # FastAPI server + RAG logic
├── frontend/         # React UI
├── data/            # Your uploaded documents
├── docs/            # All documentation
├── README.md        # Main guide ⭐
├── QUICKSTART.md    # Fast setup ⚡
└── start.ps1        # Launch script
```

---

**Ready?** Open [README.md](README.md) or run `.\start.ps1` to begin!
