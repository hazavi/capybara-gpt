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

## Step 4: Use It!

1. Click the **+** button next to the message input
2. Upload a PDF/TXT/MD file
3. Wait for "Document uploaded successfully"
4. Ask questions about your document in the chat!

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

**Need detailed help?**

- Full guide: [README.md](README.md)
- Installation issues: [docs/OLLAMA_INSTALL.md](docs/OLLAMA_INSTALL.md)
- Other problems: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
