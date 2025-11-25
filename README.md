[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)

# CapybaraGPT

**Privacy-first AI assistant with RAG capabilities - Fully local, fully open source.**

**Key Differentiators:**

- ✅ Zero external dependencies after installation
- ✅ Enterprise-grade privacy and security
- ✅ Extensible architecture with REST API
- ✅ Production-optimized with GPU acceleration

---

## ⚡ Quick Start

### Prerequisites

Ensure the following are installed on your system:

- Python 3.11 or higher
- Node.js 18 or higher
- Ollama runtime

### Installation

**1. Install and Configure Ollama**

```bash
# Install Ollama from https://ollama.com
# Pull your preferred model
ollama pull llama3.1

# Start Ollama server
ollama serve
```

**2. Launch Application**

```powershell
# Windows
.\start.ps1

# Linux/macOS
./start.sh
```

**3. Access Interface**

- **Web UI:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs
- **API Server:** http://localhost:8000

---

## ⚙️ Performance Considerations

### Inference Latency

Response times vary based on multiple factors:

| Factor             | Impact                         | Optimization                             |
| ------------------ | ------------------------------ | ---------------------------------------- |
| **Hardware**       | CPU/GPU compute capacity       | Enable GPU layers (`num_gpu: -1`)        |
| **Model Size**     | Parameters count affects speed | Use quantized models (e.g., `phi3:mini`) |
| **Context Length** | Token count in conversation    | Reduce `num_ctx` to 1024-2048            |
| **RAG Retrieval**  | Document search overhead       | Limit `n_results` to 1-2 chunks          |

### Performance Tuning

All configuration parameters are documented inline:

- **Backend Configuration:** `backend/ollama_client.py` (🎯 marked sections)
- **RAG Optimization:** `backend/rag.py` (⚡ marked sections)

**Recommended Settings for Speed:**

```python
num_ctx: 1024          # Reduce context window
num_predict: 1024      # Limit output tokens
num_thread: 16         # Increase CPU threads
num_gpu: -1            # Maximize GPU usage
```

---

## 🎯 Core Capabilities

### Conversational AI

**General Purpose Interaction**

- Natural language understanding across domains (STEM, humanities, creative writing)
- Multi-turn conversations with context awareness
- Code generation and technical problem-solving
- Real-time streaming responses with interruption support

### Document Intelligence (RAG)

**Retrieval Augmented Generation**

- Multi-format document processing (PDF, TXT, Markdown)
- Semantic search with ChromaDB vector database
- Context-aware question answering with source attribution
- Automatic text chunking with configurable overlap
- Persistent embedding storage

### Developer Tools

**Code Assistance**

- Multi-language code generation and explanation
- Syntax error detection and debugging
- Code review with best practices suggestions
- Algorithm design and optimization

### Enterprise Features

**Privacy & Control**

- Air-gapped operation (no external API calls)
- Complete data sovereignty
- GDPR/HIPAA-compliant architecture
- Audit trail via conversation history
- Customizable system prompts

**Customization**

- Model selection (Llama, Phi, Mistral, GPT-OSS, DeepSeek)
- Personality and tone configuration
- Response style tuning (concise/detailed)
- Theme customization (OKLCH color system)

## 🏗️ Architecture Overview

### Standard Mode (Direct LLM Interaction)

```
User Query → FastAPI Backend → Ollama LLM → Streaming Response
```

**Use Case:** General conversations, coding assistance, creative tasks

### RAG Mode (Document-Enhanced)

```
User Query → Vector Search (ChromaDB) → Context Retrieval
     ↓
 System Prompt + Context + Query → Ollama LLM → Response
```

**Process Flow:**

1. **Document Upload** - Files processed and chunked (500-1000 tokens)
2. **Embedding Generation** - Sentence-transformers create vector representations
3. **Storage** - ChromaDB persists embeddings locally
4. **Query Processing** - Semantic search retrieves relevant chunks
5. **Augmentation** - Context injected into system prompt
6. **Generation** - LLM produces context-aware response

**Technical Details:**

- **Embedding Model:** `all-MiniLM-L6-v2` (384 dimensions)
- **Similarity Metric:** Cosine similarity
- **Storage:** Persistent ChromaDB with SQLite backend
- **Chunking Strategy:** Recursive with overlap for context preservation

---

## 📋 System Requirements

### Software Dependencies

| Component   | Version | Purpose                  | Installation                                    |
| ----------- | ------- | ------------------------ | ----------------------------------------------- |
| **Python**  | 3.11+   | Backend runtime          | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18+     | Frontend build toolchain | [nodejs.org](https://nodejs.org/)               |
| **Ollama**  | Latest  | LLM inference engine     | [ollama.com](https://ollama.com)                |

### Hardware Recommendations

| Configuration   | CPU       | RAM   | GPU       | Use Case                    |
| --------------- | --------- | ----- | --------- | --------------------------- |
| **Minimum**     | 4 cores   | 8GB   | None      | Small models (phi3:mini)    |
| **Recommended** | 8 cores   | 16GB  | 4GB VRAM  | Medium models (llama3.1:8b) |
| **Optimal**     | 16+ cores | 32GB+ | 8GB+ VRAM | Large models (gpt-oss:20b)  |

### Environment Verification

```powershell
# Run diagnostics
.\check-env.ps1

# Expected output:
# ✓ Python 3.11+ detected
# ✓ Node.js 18+ detected
# ✓ Ollama service running
# ✓ Ports 3000, 8000 available
```

## 🎨 Configuration

### Model Selection

**Available Models:**

| Model         | Parameters | Speed  | Quality    | Use Case             |
| ------------- | ---------- | ------ | ---------- | -------------------- |
| `phi3:mini`   | 3.8B       | ⚡⚡⚡ | ⭐⭐       | Fast prototyping     |
| `llama3.1:8b` | 8B         | ⚡⚡   | ⭐⭐⭐     | Balanced performance |
| `gpt-oss:20b` | 20B        | ⚡     | ⭐⭐⭐⭐   | Production quality   |
| `deepseek-r1` | Varies     | ⚡     | ⭐⭐⭐⭐⭐ | Advanced reasoning   |

**Installation:**

```bash
# Pull model from Ollama registry
ollama pull llama3.1

# Verify installation
ollama list

# Test model
ollama run llama3.1 "Hello, world!"
```

**Runtime Selection:**

- Dynamic model switching via UI dropdown (no restart required)
- Auto-detection of installed models
- Per-conversation model persistence

### Application Configuration

**UI Customization:**

- Access Settings (⚙️) in sidebar

- **Response Style** - Professional, casual, or default
- **Conciseness** - Brief or detailed responses
- **Tone** - Warm, enthusiastic, formal, etc.
- **Emoji Usage** - More, less, or default
- **Theme** - Dark or light mode

### Change Ports

- **Backend**: Edit `backend/app.py` (default: 8000)
- **Frontend**: Edit `frontend/vite.config.js` (default: 3000)

### Speed Up AI Responses ⚡

**Backend code has detailed comments for tuning:**

1. **`backend/ollama_client.py`** - Adjust these for faster responses:

   - `num_predict`: Lower = faster (try 1024)
   - `num_ctx`: Lower = faster (try 1024)
   - `num_thread`: Higher = faster if CPU allows (try 16)
   - `num_gpu`: Set to `-1` to use all GPU layers (fastest)
   - `timeout`: Lower to fail faster (try 120)

2. **`backend/rag.py`** - Adjust these for faster RAG:

   - `n_results`: Number of document chunks (try 1 for speed)
   - `doc_truncated`: Character limit per chunk (try 300)
   - `history[-2:]`: Conversation memory (try `[-1:]` for speed)
   - Truncation limit: 150 chars (try 100)

3. **System Prompts** - Edit in `backend/rag.py`:
   - Shorter prompts = faster responses
   - Customize AI personality and behavior
   - All locations marked with 🎯 comments

**All tuning options are documented with inline comments in the code!**

## 💡 Usage Examples

**General Questions:**

```
"Explain quantum computing in simple terms"
"Write a Python function to sort a list"
"What are the health benefits of meditation?"
```

**Coding Help:**

```
"Debug this JavaScript error: [paste code]"
"How do I implement a binary search tree?"
"Review this code for best practices"
```

**Document Analysis:**

```
Upload a PDF, then ask:
"Summarize the main points of this document"
"What does section 3 say about data privacy?"
"Extract all the key dates mentioned"
```

**Creative Tasks:**

```
"Write a short story about a time traveler"
"Brainstorm 10 business ideas for a coffee shop"
"Create a workout plan for beginners"
```

## 🔧 Troubleshooting

<details>
<summary><b>Ollama not connecting?</b></summary>

```bash
ollama serve  # Ensure Ollama is running
```

</details>

<details>
<summary><b>Port already in use?</b></summary>

```powershell
.\check-env.ps1  # Check port conflicts
```

</details>

<details>
<summary><b>Dependencies failing?</b></summary>

```powershell
pip install -r backend/requirements.txt
npm install --prefix frontend
```

</details>

**Need more help?** → [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 📚 Documentation

- **[docs/OLLAMA_INSTALL.md](docs/OLLAMA_INSTALL.md)** - Complete Ollama installation guide
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Fix common problems
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - How it works under the hood
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Help improve this project

## 🔗 API Documentation

When running, visit **http://localhost:8000/docs** for interactive API documentation.

## ✨ Key Features

### 💬 Chat Interface

- **Streaming Responses** - Real-time AI generation
- **Message Actions** - Copy, edit, regenerate messages
- **Stop Generation** - Interrupt AI mid-response
- **Chat History** - Collapsible sidebar with search
- **Memory Control** - Temporary or saved conversations

### 🎨 Customization

- **Theme System** - Dark/light mode with OKLCH colors
- **Model Selector** - Switch between AI models instantly
- **Settings Panel** - Personalize AI personality and tone
- **Code Highlighting** - Syntax highlighting with copy buttons

### 📄 Document Intelligence

- **Multi-format Support** - PDF, TXT, Markdown
- **RAG Integration** - ChromaDB vector search
- **Context-aware** - AI uses document context

### ⚡ Performance

- **GPU Acceleration** - Automatic GPU detection
- **Optimized RAG** - Fast document retrieval
- **Tunable Parameters** - All settings documented in code

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Open Source Commitment:**

- Free for commercial and personal use
- Modification and distribution permitted
- No warranty or liability

---

## 🤝 Contributing

We welcome contributions from the community!

**Ways to Contribute:**

- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features or improvements
- 📖 Improve documentation
- 🔧 Submit pull requests

**Development Setup:**

```bash
git clone https://github.com/hazavi/capybara-v2.git
cd capybara-v2
.\check-env.ps1
.\start.ps1
```

**Guidelines:** See [CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

## 📚 Additional Resources

- **Documentation:** [docs/](docs/) - Comprehensive guides
- **API Reference:** http://localhost:8000/docs - Interactive API docs
- **Issue Tracker:** GitHub Issues - Bug reports and feature requests
- **Changelog:** [CHANGELOG.md](docs/CHANGELOG.md) - Version history

---

## 💬 Support

**Having trouble?**

- 📖 Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- 🔍 Search existing GitHub Issues
- 💡 Open a new issue with detailed information

---

<div align="center">

[Report Bug](https://github.com/hazavi/capybara-v2/issues) · [Request Feature](https://github.com/hazavi/capybara-v2/issues) · [Documentation](docs/)

</div>
