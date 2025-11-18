# Environment Check Script for RAG Chatbot
# Verifies all prerequisites are installed and configured correctly

Write-Host "[CHECK] RAG Chatbot Environment Check" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python 3\.(1`[1-9`]|`[2-9`]\d)") {
        Write-Host "[OK] $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] $pythonVersion (Python 3.11+ recommended)" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host "[ERROR] Python not found. Install from https://www.python.org/" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    if ($nodeVersion -match "v(1`[8-9`]|`[2-9`]\d)") {
        Write-Host "[OK] Node.js $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Node.js $nodeVersion (v18+ recommended)" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host "[ERROR] Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm not found. Install Node.js from https://nodejs.org/" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check Ollama
Write-Host "Checking Ollama..." -ForegroundColor Yellow
$ollamaInstalled = $false
try {
    $ollamaVersion = ollama --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] $ollamaVersion" -ForegroundColor Green
        $ollamaInstalled = $true
    }
} catch {
    # Ollama not found
}

if (-not $ollamaInstalled) {
    Write-Host "[ERROR] Ollama not found" -ForegroundColor Red
    Write-Host "" 
    Write-Host "   [INSTALL] Install Ollama:" -ForegroundColor Yellow
    Write-Host "   1. Download from: https://ollama.com/download/windows" -ForegroundColor White
    Write-Host "   2. Run the installer" -ForegroundColor White
    Write-Host "   3. Restart PowerShell/Terminal" -ForegroundColor White
    Write-Host "   4. Run: ollama --version" -ForegroundColor White
    Write-Host ""
    $allGood = $false
} else {
    # Check if Ollama is running
    Write-Host "Checking Ollama service..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction Stop
        Write-Host "[OK] Ollama service is running" -ForegroundColor Green
        
        # List available models
        $models = ($response.Content | ConvertFrom-Json).models
        if ($models.Count -gt 0) {
            Write-Host "[OK] Available models:" -ForegroundColor Green
            foreach ($model in $models) {
                Write-Host "   - $($model.name)" -ForegroundColor White
            }
        } else {
            Write-Host "[WARNING] No models installed. Run: ollama pull llama3.1" -ForegroundColor Yellow
            $allGood = $false
        }
    } catch {
        Write-Host "[ERROR] Ollama service not running. Run: ollama serve" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan

# Check Python packages
Write-Host ""
Write-Host "Checking Python packages..." -ForegroundColor Yellow
$requiredPackages = @("fastapi", "uvicorn", "chromadb", "pypdf", "requests", "sentence-transformers")
$missingPackages = @()

foreach ($package in $requiredPackages) {
    $installed = pip show $package 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] $package installed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $package not installed" -ForegroundColor Red
        $missingPackages += $package
    }
}

if ($missingPackages.Count -gt 0) {
    Write-Host ""
    Write-Host "Install missing packages with:" -ForegroundColor Yellow
    Write-Host "cd backend; pip install -r requirements.txt" -ForegroundColor White
    $allGood = $false
}

# Check Node packages
Write-Host ""
Write-Host "Checking frontend setup..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "[OK] Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Frontend dependencies not installed" -ForegroundColor Red
    Write-Host "Install with: cd frontend; npm install" -ForegroundColor White
    $allGood = $false
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

if ($allGood) {
    Write-Host "[SUCCESS] All checks passed! You're ready to run the chatbot." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: .\start.ps1" -ForegroundColor White
    Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
} else {
    Write-Host "[WARNING] Some issues need to be fixed before running." -ForegroundColor Yellow
    Write-Host "Please address the items marked with ❌ above." -ForegroundColor Yellow
}

Write-Host ""
