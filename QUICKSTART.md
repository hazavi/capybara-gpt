# 🚀 Quick Start Guide

**Get CapybaraGPT running in 3 minutes.**

---

## Prerequisites

✅ Python 3.11+ installed  
✅ Node.js 18+ installed  
✅ 8GB+ RAM recommended

---

## Installation Steps

### 1️⃣ Install Ollama

Download from **[ollama.com](https://ollama.com)**

```bash
ollama pull llama3.1
ollama serve
```

> 💡 Keep this terminal open

### 2️⃣ Start Application

```powershell
.\start.ps1
```

> Automatically installs dependencies and starts both servers

### 3️⃣ Open Browser

Navigate to **http://localhost:3000**

### 4️⃣ Start Chatting!

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

---

## 🔧 Troubleshooting

### Common Issues

| Problem               | Solution                     |
| --------------------- | ---------------------------- |
| Ollama not responding | Run `ollama serve` first     |
| Port conflict         | Check with `.\check-env.ps1` |
| Model not found       | Run `ollama list` to verify  |

### Verify Installation

```bash
ollama list          # Check installed models
ollama ps            # Check running models
.\check-env.ps1      # Verify environment
```

---

## 🎯 Next Steps

### Explore Features

- 🎨 **Customize AI** → Click Settings (⚙️) in sidebar
- 🤖 **Change Model** → Use dropdown next to send button
- 💬 **Manage Chats** → Rename/delete in sidebar
- 🌓 **Toggle Theme** → Dark/light mode in settings

### Learn More

- 📚 **Full Documentation** → [README.md](README.md)
- 🏗️ **Architecture** → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- 🤝 **Contributing** → [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- 🐛 **Issues?** → [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
