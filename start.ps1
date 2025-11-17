# Start RAG Chatbot - Backend and Frontend
# This script starts both the backend (FastAPI) and frontend (Vite) servers

Write-Host "🦙 Starting RAG Chatbot..." -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
Write-Host "Checking Ollama installation..." -ForegroundColor Yellow
try {
    $null = ollama --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Ollama not installed"
    }
    Write-Host "✅ Ollama is installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Ollama is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Please install Ollama first:" -ForegroundColor Yellow
    Write-Host "   1. Download from: https://ollama.com/download/windows" -ForegroundColor Cyan
    Write-Host "   2. Run the installer" -ForegroundColor White
    Write-Host "   3. Restart this terminal" -ForegroundColor White
    Write-Host "   4. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "   Press any key to open download page..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "https://ollama.com/download/windows"
    exit
}

Write-Host ""

# Check if Ollama is running
Write-Host "Checking Ollama connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Ollama is running" -ForegroundColor Green
    }
}
catch {
    Write-Host "⚠️  Warning: Ollama service is not running" -ForegroundColor Red
    Write-Host "   Starting Ollama automatically..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   If this fails, manually run in another terminal:" -ForegroundColor Yellow
    Write-Host "   1. ollama serve" -ForegroundColor Cyan
    Write-Host "   2. ollama pull deepseek-r1" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Yellow

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; python app.py"

Write-Host "✅ Backend started (http://localhost:8000)" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow

# Check if node_modules exists
if (-not (Test-Path "$PSScriptRoot\frontend\node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm install; Write-Host 'Starting dev server...'; npm run dev" -Wait:$false
}
else {
    # Start frontend in a new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '⚛️  Frontend Server Starting...' -ForegroundColor Cyan; npm run dev"
}

Write-Host "✅ Frontend started (http://localhost:3000)" -ForegroundColor Green

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 RAG Chatbot is ready!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "📍 Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "📍 API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
