# 📖 Start Here!

Welcome to **CapybaraGPT** - Your private ChatGPT alternative that runs 100% locally on your computer!

💬 **Chat about anything** - Ask questions, get coding help, brainstorm ideas
📄 **Analyze documents** - Upload PDFs/TXT/MD files and ask questions about them
🔒 **Complete privacy** - Everything stays on your machine, no cloud, no tracking

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

That's it! Start chatting immediately, or click the **+** button to upload documents for analysis.

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

- **Ask anything**: General questions, coding help, creative tasks - no documents needed!
- **Switch models**: Use the dropdown menu in chat to change AI models
- **Personalize**: Click Settings (⚙️) to customize AI personality and style
- **Check your setup**: Run `.\check-env.ps1`
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
