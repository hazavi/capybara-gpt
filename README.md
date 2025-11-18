# 🦙 RAG Chatbot - Chat with Your Documents Locally

A full-stack chatbot that lets you upload documents and ask questions about them using AI that runs 100% on your machine. No cloud, no API keys, complete privacy!

## ⚡ Quick Start (3 Steps)

### 1. Install Ollama

Download from [ollama.com](https://ollama.com) and run:

```bash
ollama pull llama3.1
ollama serve
```

### 2. Start the App

```powershell
.\start.ps1
```

### 3. Open Browser

Go to **http://localhost:3000** and start chatting!

---

## 🌟 Features

- **100% Local & Private** - Everything runs on your machine
- **Upload Documents** - PDF, TXT, Markdown support
- **Smart AI Answers** - Ask questions, get context-aware responses
- **Modern UI** - Clean ChatGPT-style interface
- **Any LLM Model** - Use LLaMA, Phi, Mistral, DeepSeek, etc.

## 💡 How It Works

1. Click the **+** button in the chat interface
2. Upload documents (PDF, TXT, MD)
3. Documents are chunked and embedded
4. Ask questions in natural language
5. AI finds relevant info and generates answers
6. All processing happens locally on your machine

---

## 🛠️ Requirements

- **Python 3.11+**
- **Node.js 18+**
- **Ollama** ([download here](https://ollama.com))

Check if you have everything:

```powershell
.\check-env.ps1
```

## 🎨 Customization

### Use a Different LLM Model

```bash
# Try different models
ollama pull deepseek-r1    # Advanced reasoning
ollama pull phi3:mini      # Fast & light
ollama pull mistral        # Alternative

# Find more: https://ollama.com/search
```

Then edit `backend/ollama_client.py`:

```python
MODEL_NAME = "llama3.1"  # Current default
```

### Change Ports

- **Backend**: Edit `backend/app.py` (default: 8000)
- **Frontend**: Edit `frontend/vite.config.js` (default: 3000)

## ❓ Common Issues

**Ollama not connecting?**

```bash
ollama serve  # Make sure this is running
```

**Port already in use?**

```powershell
.\check-env.ps1  # This will help identify the issue
```

**Dependencies failing?**

```powershell
pip install -r backend/requirements.txt
npm install --prefix frontend
```

📖 **More help**: See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 📚 Documentation

- **[docs/OLLAMA_INSTALL.md](docs/OLLAMA_INSTALL.md)** - Complete Ollama installation guide
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Fix common problems
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - How it works under the hood
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Help improve this project

## 🔗 API Documentation

When running, visit **http://localhost:8000/docs** for interactive API documentation.

## 📝 License

MIT License - Use freely!

---

**Need help?** Check the [docs](docs/) folder or open an issue!
