# 🤝 Contributing

Want to help make CapybaraGPT better? Here's how!

## 🚀 Quick Start

```bash
# 1. Get code and install
git clone <your-repo-url>
cd capybara-v2
cd backend; pip install -r requirements.txt
cd ../frontend; npm install
cd ..; .\check-env.ps1

# 2. Make changes, then test
.\start.ps1  # Opens http://localhost:3000

# 3. Submit
git add .
git commit -m "What you changed"
git push origin your-branch-name
```

## 💡 What You Can Build

### Easy

**Interface:**

- [ ] Message timestamps
- [ ] Keyboard shortcuts
- [ ] Export chat to PDF
- [ ] Search chat history
- [ ] Voice input

**Backend:**

- [ ] Health check endpoint
- [ ] Document preview
- [ ] Better error messages
- [ ] Log files

**Docs:**

- [ ] Video tutorial
- [ ] More examples
- [ ] Translations
- [ ] FAQ section

### Medium

- [ ] **Chat folders/tags** - Organize conversations
- [ ] **Select documents** - Choose which files AI reads
- [ ] **Better text splitting** - Smart document chunking
- [ ] **Multiple file upload** - Upload many files at once
- [ ] **Stream AI Response** - Stream response block for block

### Advanced

- [ ] **Hybrid search** - Keyword + semantic search
- [ ] **Multi-user** - Login system, separate data per user
- [ ] **Better RAG** - Re-ranking, query expansion
- [ ] **Redis cache** - Speed up common queries
- [ ] **Monitoring** - Track performance and errors

## 🧪 Testing

```bash
# Python
cd backend; pip install pytest; pytest

# React
cd frontend; npm install --save-dev vitest; npm test

# API
curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"text": "test"}'
```

## 📝 Before Submitting

- [ ] Follows style guide
- [ ] No debug code left
- [ ] Has error handling
- [ ] Has comments
- [ ] Docs updated
- [ ] Tested it works

## 🐛 Report Bugs

**Include:**

1. Short title
2. What happened vs. expected
3. Steps to reproduce
4. Your OS, Python/Node/Ollama versions, AI model
5. Error messages
6. Screenshots (if visual bug)

## 💬 Request Features

1. Check if already requested
2. Describe clearly
3. Explain why useful
4. Add examples

## 🎨 Design Rules

- Clean, modern (ChatGPT-style)
- Use colors from `frontend/src/index.css`
- Test: mobile/tablet/desktop
- Test: Chrome, Firefox, Safari, Edge
- Works in dark mode
- Use Tailwind CSS

## 🔧 Common Tasks

**Add API endpoint:** Edit `backend/app.py`
**Add component:** Create file in `frontend/src/`
**Add package:** `pip install X` then `pip freeze > requirements.txt` (Python) or `npm install X` (JavaScript)
**Update docs:** Edit .md files, update CHANGELOG.md

## 🎯 Priority Areas

Speed | UI improvements | Docs | Tests | Mobile support | Export chats | Better search

## 📚 Helpful Links(https://fastapi.tiangolo.com/) | [React](https://react.dev/) | [Tailwind](https://tailwindcss.com/docs) | [Ollama](https://ollama.com/docs) | [ChromaDB](https://docs.trychroma.com/)

## 🚀 Recent Features

Dark/light theme | Collapsible sidebar | Edit/regenerate messages | Stop button | Copy messages | Code highlighting | Model switcher | Saved/temporary chats | GPU support | Streaming responses

**Speed settings:** Check `ollama_client.py` and `rag.py` (look for 🎯 ⚡ emoji)

## ❓ Help

[README](../README.md) | [TROUBLESHOOTING](TROUBLESHOOTING.md) | [ARCHITECTURE](ARCHITECTURE.md)

---

**Thanks for helping!** 🙏
