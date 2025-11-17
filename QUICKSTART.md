# 🚀 Quick Start Guide

## Prerequisites Check

- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] Ollama installed from https://ollama.com

## 5-Minute Setup

### 1. Start Ollama (First Terminal)

```bash
# Pull a model (first time only)
ollama pull deepseek-r1

# Start Ollama server
ollama serve
```

Keep this terminal open!

### 2. Start the Application

**On Windows:**

```powershell
.\start.ps1
```

**On Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

This will automatically:

- Install Python dependencies
- Install Node dependencies
- Start backend on port 8000
- Start frontend on port 3000

### 3. Open the App

Go to: **http://localhost:3000**

### 4. Upload Documents

1. Click on "📁 Upload Documents" tab
2. Click "Choose a file"
3. Select a PDF, TXT, or MD file
4. Click "Upload Document"
5. Wait for processing

### 5. Start Chatting

1. Click on "💬 Chat" tab
2. Type your question
3. Press "Send" or hit Enter
4. Get AI-powered answers based on your documents!

## Troubleshooting

### Ollama not running?

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not, start it
ollama serve
```

### Port already in use?

- Backend (8000): Edit `backend/app.py`
- Frontend (3000): Edit `frontend/vite.config.js`

### Dependencies not installing?

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🔧 Customize settings in `backend/ollama_client.py`
- 📚 Add more documents to `data/` folder
- 🎨 Modify UI in `frontend/src/`

## Useful Commands

```bash
# View backend API docs
http://localhost:8000/docs

# Check loaded documents
curl http://localhost:8000/documents

# Clear all documents
curl -X DELETE http://localhost:8000/documents
```

---

**Having issues?** Check the Troubleshooting section in README.md
