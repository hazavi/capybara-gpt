# Install Backend Dependencies - Handles locked files
Write-Host "📦 Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Stop any running Python processes that might lock files
Write-Host "Checking for running Python processes..." -ForegroundColor Yellow
$pythonProcesses = Get-Process python* -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    Write-Host "Found Python processes running. Stopping them..." -ForegroundColor Yellow
    Stop-Process -Name python* -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Stopped Python processes" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installing packages with --user flag..." -ForegroundColor Yellow
Write-Host ""

cd backend

# Install with --user to avoid permission issues
pip install --user fastapi uvicorn chromadb pypdf requests sentence-transformers python-multipart aiofiles

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All packages installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: .\start-simple.ps1" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️  Some packages may have failed to install" -ForegroundColor Yellow
    Write-Host "Try running this script again, or restart your computer" -ForegroundColor Yellow
}

Write-Host ""
