# Getting Started with CapybaraGPT

> **A private ChatGPT alternative running 100% locally on your computer.**

## 🎯 What is CapybaraGPT?

CapybaraGPT is a privacy-focused AI assistant that runs entirely on your local machine. No cloud services, no data collection, no subscriptions.

**Core Capabilities:**

- 💬 **General Conversations** - Ask questions, get coding help, brainstorm ideas
- 📄 **Document Analysis** - Upload PDFs/TXT/MD and chat with your documents
- 🔒 **Complete Privacy** - Everything stays on your machine, no external connections

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

## 💡 Pro Tips

| Feature            | How to Use                          |
| ------------------ | ----------------------------------- |
| **Switch Models**  | Dropdown menu next to send button   |
| **Personalize AI** | Click Settings (⚙️) in sidebar      |
| **Speed Up**       | Use smaller models like `phi3:mini` |
| **Dark Mode**      | Toggle in settings panel            |
| **Export Chats**   | Rename and organize in sidebar      |

**Performance Tuning:** Check `backend/ollama_client.py` for detailed comments on all tunable parameters.

**Need Help?**

- 🔍 Environment check: `.\check-env.ps1`
- 📚 Browse models: [ollama.com/library](https://ollama.com/library)
- 🐛 Issues? [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

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
