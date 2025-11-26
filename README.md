<div align="center">

# CapybaraGPT

### Your Private AI Assistant That Runs Completely On Your Computer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)

[Quick Start](#quick-start) • [Features](#what-can-it-do) • [How It Works](#how-it-works) • [Documentation](#documentation)

</div>

---

## Why Choose CapybaraGPT?

```
┌─────────────────────────────────────────────────────────────┐
│  Traditional Cloud AI          CapybaraGPT (Local AI)       │
├─────────────────────────────────────────────────────────────┤
│  Your data sent to servers  →  Everything stays on your PC  │
│  Monthly subscription fees  →  Free and open source         │
│  Internet required          →  Works offline                │
│  Privacy concerns           →  Complete data control        │
│  Rate limits                →  Unlimited usage              │
└─────────────────────────────────────────────────────────────┘
```

**Key Benefits:**

- **Complete Privacy** - Your conversations and documents never leave your computer
- **No Costs** - No monthly fees or usage limits
- **Full Control** - Choose your AI model and customize behavior
- **Works Offline** - No internet needed after setup
- **Fast Performance** - Uses your GPU for quick responses

---

## Quick Start

### What You Need

Before starting, install these three programs:

| Program     | Version        | What It Does             |
| ----------- | -------------- | ------------------------ |
| **Python**  | 3.11 or higher | Runs the backend server  |
| **Node.js** | 18 or higher   | Builds the web interface |
| **Ollama**  | Latest version | Runs the AI models       |

### Setup Steps

**Step 1: Install Ollama and Download an AI Model**

```bash
# Download Ollama from https://ollama.com and install it

# Download an AI model (this example uses Llama 3.1)
ollama pull llama3.1

# Start Ollama
ollama serve
```

Need help? See our [detailed Ollama guide](docs/OLLAMA_INSTALL.md).

**Step 2: Start CapybaraGPT**

```powershell
# On Windows, run:
.\start.ps1

# On Linux/macOS, run:
./start.sh
```

This script automatically sets up everything you need.

**Step 3: Open Your Browser**

```
Main Interface:  http://localhost:3000
API Docs:        http://localhost:8000/docs
```

That's it! You're ready to start chatting.

---

## Making It Faster

### What Affects Speed?

| Factor              | Impact                            | How to Fix                                |
| ------------------- | --------------------------------- | ----------------------------------------- |
| **Your Hardware**   | Better CPU/GPU = faster responses | Use GPU if you have one (`num_gpu: -1`)   |
| **AI Model Size**   | Bigger models = slower            | Use smaller models like `phi3:mini`       |
| **Memory Settings** | More context = slower             | Lower `num_ctx` to 1024                   |
| **Document Search** | More documents = slower           | Use fewer search results (`n_results: 1`) |

### Quick Speed Settings

All settings have helpful comments in the code:

- Speed settings: `backend/ollama_client.py` (look for 🎯)
- Document settings: `backend/rag.py` (look for ⚡)

**Example Speed Configuration:**

```python
# In backend/ollama_client.py
num_ctx: 1024          # Less memory = faster
num_predict: 1024      # Shorter responses = faster
num_thread: 16         # More threads = faster (if your CPU supports it)
num_gpu: -1            # Use GPU = much faster

# In backend/rag.py
n_results: 1           # Search fewer documents = faster
doc_truncated: 300     # Shorter chunks = faster
```

**Pro Tip:** Small models (3B-8B size) work great for most tasks and run much faster.

---

## What Can It Do?

### Chat and Get Answers

Talk to the AI like ChatGPT, but everything stays on your computer:

- Ask questions about any topic
- Get help writing code in 30+ languages
- Have back-and-forth conversations (it remembers context)
- Customize how the AI talks (formal, casual, brief, detailed)

### Ask Questions About Your Documents

Upload PDF, TXT, or Markdown files and ask questions:

```
Example Workflow:
1. Upload: company-policy.pdf
2. Ask: "What is the vacation policy?"
3. Get: Answer with exact page references
```

The AI reads your documents and answers based on what's actually in them.

### Help With Programming

- Write code in any language
- Find and fix bugs
- Review code for improvements
- Explain how code works
- Suggest better ways to solve problems

### Privacy and Security

```
Your Data Flow:
┌──────────────┐
│ Your Computer│  ← Everything happens here
│  ┌────────┐  │
│  │  AI    │  │  ← No internet needed
│  │ Model  │  │
│  └────────┘  │
│  ┌────────┐  │
│  │ Your   │  │  ← Your files stay local
│  │ Files  │  │
│  └────────┘  │
└──────────────┘

Cloud AI Flow:
┌──────────────┐      ┌──────────────┐
│ Your Computer│ ───→ │ Cloud Servers│  ← Your data leaves
└──────────────┘      └──────────────┘
```

All processing happens locally. Your data never leaves your machine.

## How It Works

### Two Ways to Use CapybaraGPT

**1. Direct Chat Mode**

For general conversations and questions:

```
You → CapybaraGPT → AI Model → Answer
```

Simple and fast. Just ask a question and get an answer.

**2. Document Mode (RAG)**

For questions about your documents:

```
Step 1: Upload Documents
   You → Upload PDF/TXT → Stored Locally

Step 2: Ask Questions
   Your Question → Search Documents → Find Relevant Parts → AI Reads Them → Answer with Sources
```

The AI finds the right parts of your documents and uses them to answer accurately.

### Example: Document Mode in Action

```
You upload: employee-handbook.pdf (50 pages)

You ask: "How many vacation days do I get?"

System does:
1. Searches the document for vacation-related content
2. Finds: "Section 5: Time Off - Employees receive 15 days..."
3. AI reads that section
4. Answers: "You get 15 vacation days per year (from Section 5, page 12)"
```

### What's Under the Hood

| Component               | What It Does                       |
| ----------------------- | ---------------------------------- |
| **React Web Interface** | What you see and interact with     |
| **FastAPI Server**      | Handles requests and manages data  |
| **Ollama**              | Runs the AI models                 |
| **ChromaDB**            | Stores and searches your documents |

---

## System Requirements

### Software Needed

| Program     | Version      | Download                                        |
| ----------- | ------------ | ----------------------------------------------- |
| **Python**  | 3.11 or 3.12 | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18 or newer  | [nodejs.org](https://nodejs.org/)               |
| **Ollama**  | Latest       | [ollama.com](https://ollama.com)                |

**Note:** Python 3.13 may not work. Stick with 3.11 or 3.12.

### Hardware Recommendations

| Setup        | CPU       | RAM   | GPU        | Storage | Best For                     |
| ------------ | --------- | ----- | ---------- | ------- | ---------------------------- |
| **Basic**    | 4 cores   | 8GB   | Not needed | 10GB    | Testing, small models        |
| **Standard** | 8 cores   | 16GB  | 4GB VRAM   | 25GB    | Daily use, medium models     |
| **High-End** | 16+ cores | 32GB+ | 8GB+ VRAM  | 50GB+   | Large models, many documents |

**GPU Support:**

- NVIDIA cards (RTX 3060 or better)
- AMD cards (RX 6000 series)
- Apple M1/M2/M3 (works automatically)

**Storage Breakdown:**

- Program files: 5GB
- AI models: 2GB-40GB each
- Your documents: 100MB per 1000 files

### Check Your Setup

Run this command to verify everything is ready:

```powershell
.\check-env.ps1
```

You should see:

```
✓ Python 3.11+ detected
✓ Node.js 18+ detected
✓ Ollama running
✓ Ports available
✓ GPU detected (if you have one)
```

If you see errors, check the [troubleshooting guide](docs/TROUBLESHOOTING.md).

## Configuration

### Choosing AI Models

Different models work better for different tasks:

| Model           | Size         | Speed     | Quality   | Best For                      |
| --------------- | ------------ | --------- | --------- | ----------------------------- |
| **phi3:mini**   | Small (3.8B) | Very Fast | Good      | Quick tasks, older computers  |
| **llama3.1:8b** | Medium (8B)  | Fast      | Great     | Most everyday tasks           |
| **gpt-oss:20b** | Large (20B)  | Medium    | Excellent | High accuracy, production use |
| **deepseek-r1** | Medium-Large | Medium    | Excellent | Math and logic problems       |

**How to Install Models:**

```bash
# Download a model
ollama pull llama3.1

# See what models you have
ollama list

# Test a model
ollama run llama3.1 "Say hello"

# Delete a model you don't need
ollama rm phi3:mini
```

**Switching Models:**
Use the dropdown menu in the web interface to switch between models anytime.

### Customizing Behavior

Click the settings icon (⚙️) to customize:

**How the AI Responds:**

- Style: Professional, casual, or technical
- Length: Brief answers or detailed explanations
- Tone: Formal, friendly, or neutral

**Visual Settings:**

- Dark or light theme

### Changing Ports

If ports 3000 or 8000 are already in use:

```python
# Backend (edit backend/app.py)
port=8000  # Change to any available port

# Frontend (edit frontend/vite.config.js)
port: 3000  # Change to any available port
```

### Performance Settings

**For Faster Responses** (edit `backend/ollama_client.py`):

```python
num_ctx: 1024      # Lower = faster
num_predict: 1024  # Lower = faster
num_thread: 16     # Higher = faster (if your CPU can handle it)
num_gpu: -1        # Use GPU (much faster)
```

**For Document Search** (edit `backend/rag.py`):

```python
n_results: 1       # Search fewer documents
doc_truncated: 300 # Use shorter text chunks
```

All settings have comments in the code explaining what they do (look for 🎯 and ⚡ markers).

## Troubleshooting

### Common Problems

**Problem: Can't connect to Ollama**

```bash
# Make sure Ollama is running
ollama serve

# Test if it's working
curl http://localhost:11434/api/tags
```

**Problem: Port already in use**

```powershell
# Find what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Stop the program using that port
taskkill /PID [number] /F

# Or change the port in the config files
```

**Problem: Installation fails**

```powershell
# Update pip first
python -m pip install --upgrade pip

# Try installing again
pip install -r backend/requirements.txt

# Still not working? Check your Python version
# (Needs Python 3.11 or 3.12, not 3.13)
```

**Problem: AI responses are very slow**

```bash
# Check if GPU is working (NVIDIA cards)
nvidia-smi

# Make sure GPU is enabled in backend/ollama_client.py
# Look for: num_gpu: -1
```

**Problem: Document upload not working**

```powershell
# Delete the database and restart
Remove-Item -Recurse -Force embeddings/
.\start.ps1
```

### Quick Checks

```powershell
# Run system check
.\check-env.ps1

# See what models you have
ollama list

# Test the backend
curl http://localhost:8000/health
```

### Need More Help?

- Read the detailed guide: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- Search for similar issues: [GitHub Issues](https://github.com/hazavi/capybara-v2/issues)
- Report a new problem with:
  - Your operating system
  - Error messages
  - Output from `.\check-env.ps1`

## Key Features

### Chat Interface

- Real-time streaming responses (see answers as they're generated)
- Copy, edit, or regenerate any message
- Stop generation anytime
- Save conversations or use temporary sessions

### Customization

- Switch between dark and light themes
- Change AI models instantly (no restart needed)
- Adjust response style (professional, casual, etc.)
- Control answer length (brief or detailed)
- Syntax highlighting for code in 100+ languages

### Document Features

- Upload PDF, TXT, and Markdown files
- Fast semantic search finds relevant information
- AI cites exact sources (page numbers, sections)
- Add new documents anytime
- Everything stored locally on your computer

### Performance

- Automatic GPU detection and use
- Configurable for your hardware
- Parallel processing for multiple documents
- All settings explained with comments in code

## License

MIT License - see [LICENSE](LICENSE) for details.

**What this means:**

- Free for personal and commercial use
- Modify it however you want
- Share it with others
- No warranty included

You don't have to give credit, but it's appreciated!

## Documentation

### Available Guides

| Document                                      | What's Inside                     |
| --------------------------------------------- | --------------------------------- |
| [INDEX.md](docs/INDEX.md)                     | All documentation in one place    |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)       | How the system works              |
| [OLLAMA_INSTALL.md](docs/OLLAMA_INSTALL.md)   | Installing Ollama (all platforms) |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Fixing common problems            |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md)       | How to contribute code            |
| [CHANGELOG.md](docs/CHANGELOG.md)             | What's new in each version        |

### API Documentation

When the app is running, visit **http://localhost:8000/docs** for:

- List of all API endpoints
- Try the API directly in your browser
- See request/response examples

---

<div align="center">

### Found this useful?

⭐ Star the repo  
🐛 Report bugs  
💡 Suggest features  
📢 Share with others

[![Report Bug](https://img.shields.io/badge/Report-Bug-red?style=for-the-badge)](https://github.com/hazavi/capybara-v2/issues)
[![Request Feature](https://img.shields.io/badge/Request-Feature-blue?style=for-the-badge)](https://github.com/hazavi/capybara-v2/issues)
[![Documentation](https://img.shields.io/badge/Read-Documentation-green?style=for-the-badge)](docs/)

_Private AI for everyone_

</div>
