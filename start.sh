#!/bin/bash
# Start RAG Chatbot - Backend and Frontend (Linux/Mac version)

echo "[START] Starting RAG Chatbot..."
echo ""

# Check if Ollama is running
echo "Checking Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "[OK] Ollama is running"
else
    echo "[WARNING] Cannot connect to Ollama at http://localhost:11434"
    echo "   Make sure Ollama is installed and running:"
    echo "   1. Install from https://ollama.com"
    echo "   2. Run: ollama serve"
    echo "   3. Pull a model: ollama pull llama3:8b"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "Starting Backend Server..."

# Start backend in background
cd backend
python app.py &
BACKEND_PID=$!

echo "[OK] Backend started (http://localhost:8000) - PID: $BACKEND_PID"
sleep 3

echo ""
echo "Starting Frontend Server..."

# Check if node_modules exists
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "[NPM] Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!

echo "[OK] Frontend started (http://localhost:3000) - PID: $FRONTEND_PID"

echo ""
echo "==================================================="
echo "[SUCCESS] RAG Chatbot is ready!"
echo "==================================================="
echo ""
echo "[>] Frontend:  http://localhost:3000"
echo "[>] Backend:   http://localhost:8000"
echo "[>] API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait for both processes
wait
