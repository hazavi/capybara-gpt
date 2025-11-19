# 🦫 CapybaraGPT - Your Private ChatGPT Alternative

A powerful AI assistant that runs completely on your local machine. Chat about anything, get help with coding, upload documents for analysis, and maintain complete privacy. Think ChatGPT, but 100% offline!

## ⚡ Quick Start (3 Steps)

### 1. Install Ollama

Download from [ollama.com](https://ollama.com) and run:

```bash
ollama pull llama3.1
# Or try: deepseek-r1, gpt-oss:20b
ollama serve
```

### 2. Start the App

```powershell
.\start.ps1
```

### 3. Open Browser

Go to **http://localhost:3000** and start chatting!

---

## 🌟 What Can You Do?

### 💬 **General Conversations**

- Ask any question - science, math, history, philosophy
- Get coding help and debug assistance
- Generate creative content (stories, poems, ideas)
- Brainstorm and problem-solve
- Learn new topics with explanations

### 📄 **Document Intelligence**

- Upload PDFs, TXT, or Markdown files
- Ask questions about your documents
- Summarize long documents
- Extract key information
- Compare multiple documents

### 💻 **Coding Assistant**

- Write code in any language
- Debug and fix errors
- Explain complex code
- Code reviews and suggestions
- Algorithm explanations

### 🎨 **Personalization**

- Customize AI personality and tone
- Choose response style (concise/detailed)
- Adjust formality and warmth
- Multiple AI model selection
- Dark/Light theme

### 🔒 **100% Private**

- All processing on your machine
- No internet connection needed (after setup)
- No data leaves your computer
- No API keys or subscriptions
- Complete conversation privacy

## 💡 How It Works

**Without Documents:**
Just type your question and get AI-powered answers on any topic. Perfect for general questions, coding help, creative tasks, or learning.

**With Documents:**

1. Click the **+** button to upload documents (PDF, TXT, MD)
2. Documents are processed and stored locally
3. Ask questions about your documents
4. AI retrieves relevant context and provides accurate answers
5. Your documents stay private on your machine

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

### Switch AI Models

**Download models:**

```bash
# Different models for different needs
ollama pull llama3.1        # Balanced - good all-around
ollama pull deepseek-r1     # Advanced reasoning
ollama pull phi3:mini       # Fast & lightweight
ollama pull gpt-oss:20b     # Powerful performance

# Find more: https://ollama.com/search
```

**Switch models:**

- Use the dropdown menu in the chat interface (next to send button)
- Models are automatically detected and listed
- Switch anytime - no restart needed

### Personalize AI Responses

Click the **Settings** button (⚙️) in the sidebar to customize:

- **Response Style** - Professional, casual, or default
- **Conciseness** - Brief or detailed responses
- **Tone** - Warm, enthusiastic, formal, etc.
- **Emoji Usage** - More, less, or default
- **Theme** - Dark or light mode

### Change Ports

- **Backend**: Edit `backend/app.py` (default: 8000)
- **Frontend**: Edit `frontend/vite.config.js` (default: 3000)

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

## 🎯 Key Features Highlights

- ✅ **Chat History** - Collapsible sidebar with all conversations
- ✅ **Rename Chats** - Organize conversations with custom titles
- ✅ **Model Selector** - Switch between AI models instantly
- ✅ **Document Upload** - Drag & drop or click to upload
- ✅ **Settings Panel** - Full personalization controls
- ✅ **Dark/Light Theme** - Easy on the eyes, day or night
- ✅ **Code Highlighting** - Beautiful syntax highlighting for code blocks
- ✅ **Markdown Support** - Rich formatted responses
- ✅ **Memory Control** - Choose whether to save conversations
- ✅ **Fast Response** - Optimized for quick AI replies

## 📝 License

MIT License - Use freely!

---

**Need help?** Check the [docs](docs/) folder or open an issue!

**Want more features?** This is a ChatGPT-like experience that runs entirely offline. Ask me anything - coding, general knowledge, document analysis, creative writing, and more!
