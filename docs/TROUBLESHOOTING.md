# 🔧 Troubleshooting Guide

Common issues and their solutions for the RAG Chatbot.

## 🚨 Ollama Issues

### Error: "Cannot connect to Ollama"

**Cause**: Ollama service is not running

**Solutions**:

```bash
# 1. Start Ollama
ollama serve

# 2. Check if Ollama is running
curl http://localhost:11434/api/tags

# 3. Verify model is installed
ollama list
```

### Error: "Model not found"

**Cause**: The specified model hasn't been pulled

**Solution**:

```bash
# Pull the model specified in backend/ollama_client.py
ollama pull llama3.1

# Or use a different model
ollama pull llama3:8b
ollama pull phi3:mini
```

### Ollama runs on different port

**Solution**: Edit `backend/ollama_client.py`:

```python
OLLAMA_URL = "http://localhost:YOUR_PORT/api/generate"
```

## 🐍 Backend Issues

### Error: "Module not found"

**Cause**: Python dependencies not installed

**Solution**:

```bash
cd backend
pip install -r requirements.txt
```

### Error: "Port 8000 already in use"

**Solutions**:

**Option 1** - Kill the process:

```powershell
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# Linux/Mac
kill -9 $(lsof -ti:8000)
```

**Option 2** - Change the port in `backend/app.py`:

```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Use different port
```

### Error: "ChromaDB errors"

**Cause**: Corrupted embeddings database

**Solution**:

```powershell
# Delete and recreate embeddings
Remove-Item -Recurse -Force embeddings
# Restart backend - will create fresh database
```

### Error: "Document upload fails"

**Checks**:

1. File format is PDF, TXT, or MD
2. File is not corrupted
3. File size is reasonable (< 50MB)
4. Backend has write permissions to `data/` folder

## ⚛️ Frontend Issues

### Error: "Cannot GET /ask"

**Cause**: Backend is not running or proxy not configured

**Solutions**:

1. Verify backend is running on port 8000
2. Check `frontend/vite.config.js` proxy settings
3. Try accessing backend directly: http://localhost:8000

### Error: "npm install fails"

**Solutions**:

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: "Port 3000 already in use"

**Solutions**:

**Option 1** - Kill the process:

```powershell
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Linux/Mac
kill -9 $(lsof -ti:3000)
```

**Option 2** - Use different port:
Edit `frontend/vite.config.js`:

```javascript
server: {
  port: 3001,  // Use different port
}
```

### UI not loading / blank page

**Solutions**:

1. Check browser console for errors (F12)
2. Clear browser cache
3. Verify Node.js version: `node --version` (needs 18+)
4. Rebuild: `cd frontend && npm run build`

## 🐳 Docker Issues

### Error: "Cannot connect to Docker daemon"

**Solution**:

```bash
# Start Docker Desktop (Windows/Mac)
# Or start Docker service (Linux)
sudo systemctl start docker
```

### Error: "Port conflicts with Docker"

**Solution**: Edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8001:8000" # Change external port
```

### Error: "Ollama not accessible from container"

**Solution**: Use `host.docker.internal` in Docker containers:

```yaml
environment:
  - OLLAMA_URL=http://host.docker.internal:11434
```

## 📁 File & Permission Issues

### Error: "Permission denied" when uploading

**Solution**:

```bash
# Grant write permissions to data directory
chmod -R 777 data
chmod -R 777 embeddings
```

### Error: "Cannot read PDF"

**Causes**:

- PDF is encrypted/password protected
- PDF is scanned image (no text)
- PDF is corrupted

**Solutions**:

1. Remove password protection
2. Use OCR tool to extract text first
3. Try a different PDF

## 🔍 Performance Issues

### Slow response times

**Solutions**:

1. Use smaller/faster model: `ollama pull phi3:mini` or `ollama pull llama3:8b`
2. Reduce chunk count in `backend/rag.py`:
   ```python
   n_results=2  # Instead of 3
   ```
3. Use smaller chunks in `backend/docs_loader.py`
4. Upgrade hardware (RAM, CPU)

### High memory usage

**Solutions**:

1. Use quantized models (smaller sizes)
2. Reduce context window
3. Clear old embeddings periodically
4. Restart services

## 🌐 Network Issues

### Error: "CORS policy blocked"

**Solution**: Already configured, but if issues persist, check `backend/app.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Cannot access from other devices

**Solution**: Change backend to listen on all interfaces:

```python
# backend/app.py
uvicorn.run(app, host="0.0.0.0", port=8000)  # Already configured
```

Then access via: `http://YOUR_IP:3000`

## 🧪 Testing Issues

### How to verify backend is working

```bash
# 1. Health check
curl http://localhost:8000

# 2. Check documents
curl http://localhost:8000/documents

# 3. Test chat
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "stream": false}'
```

### How to verify Ollama is working

```bash
# 1. List models
ollama list

# 2. Test generation
ollama run deepseek-r1 "Say hello"

# 3. Check API
curl http://localhost:11434/api/tags
```

## 🆘 Still Having Issues?

1. **Check logs**: Look for error messages in terminal windows
2. **Run environment check**: `.\check-env.ps1`
3. **Restart everything**: Stop all services and start fresh
4. **Check versions**: Ensure Python 3.11+, Node 18+
5. **Update dependencies**:
   ```bash
   cd backend && pip install --upgrade -r requirements.txt
   cd frontend && npm update
   ```

## 📞 Getting Help

If you're still stuck:

1. Check the [README.md](README.md) for detailed setup
2. Review [QUICKSTART.md](QUICKSTART.md) for basic setup
3. Search for error message online
4. Check Ollama documentation: https://ollama.com/docs
5. Check FastAPI documentation: https://fastapi.tiangolo.com
6. Check React documentation: https://react.dev

---

**Most issues are solved by ensuring Ollama is running and all dependencies are installed!**
