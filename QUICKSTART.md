# 🚀 3-Minute Quick Start

## Step 1: Install Ollama

Download from **[ollama.com](https://ollama.com)** then:

```bash
ollama pull llama3.1
ollama serve
```

> Keep this terminal open!

## Step 2: Start Everything

```powershell
.\start.ps1
```

This automatically installs dependencies and starts both backend + frontend.

## Step 3: Open Browser

Go to **http://localhost:3000**

## Step 4: Start Chatting!

> ⏱️ **Note**: AI responses take seconds or minutes depending on your computer's speed and model size. Smaller models like `phi3:mini` are faster but less capable.

**Ask anything immediately:**

- "Explain quantum computing in simple terms"
- "Write a Python function to reverse a string"
- "What are the benefits of meditation?"

**Or analyze documents:**

1. Click the **+** button next to the message input
2. Upload a PDF/TXT/MD file
3. Wait for "Document uploaded successfully"
4. Ask questions about your document!

---

## ❓ Problems?

**Ollama not working?**

```bash
ollama serve  # Run this first
```

**Already installed before?**

```bash
ollama list  # Check your models
```

**Try these features:**

- 🎨 **Settings** - Click ⚙️ to customize AI personality
- 🤖 **Model Selector** - Switch between AI models (dropdown next to send button)
- 💬 **Chat History** - Manage conversations in sidebar
- 🌓 **Theme** - Dark/light mode in settings

**Need detailed help?**

- Full guide: [README.md](README.md)
- Installation issues: [docs/OLLAMA_INSTALL.md](docs/OLLAMA_INSTALL.md)
- Other problems: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
