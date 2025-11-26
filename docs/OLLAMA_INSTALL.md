# Ollama Installation Guide

## What is Ollama?

Ollama lets you run AI models on your computer. CapybaraGPT needs it to work.

## Windows Installation

### Official Installer (Recommended)

**Step 1: Download**

- Go to https://ollama.com/download/windows
- Click "Download for Windows"
- File size: ~200MB

**Step 2: Install**

- Run `OllamaSetup.exe`
- Follow the installer steps

**Step 3: Verify**

```powershell
# Close and reopen PowerShell, then:
ollama --version
```

You should see: `ollama version is 0.x.x`

**Step 4: Start Ollama**

```powershell
ollama serve
```

Keep this terminal open! Ollama must run in the background.

**Step 5: Download AI Model** (open new terminal)

```powershell
# Default model (14GB download)
ollama pull gpt-oss:20b
```

This downloads the AI model. Takes a while on first run!

### Method 2: Winget (Command Line)

```powershell
# Install via Windows Package Manager
winget install Ollama.Ollama

# Restart terminal
# Then verify
ollama --version
```

## Linux Installation

### Ubuntu/Debian

```bash
# One-line install
curl -fsSL https://ollama.com/install.sh | sh

# Verify
ollama --version

# Start service
ollama serve
```

### Manual Install

```bash
# Download binary
curl -L https://ollama.com/download/ollama-linux-amd64 -o ollama
chmod +x ollama
sudo mv ollama /usr/local/bin/

# Start
ollama serve
```

## macOS Installation

### Method 1: Download Installer

1. Go to: https://ollama.com/download/mac
2. Download `Ollama-darwin.zip`
3. Unzip and drag to Applications folder
4. Open Ollama from Applications

### Method 2: Homebrew

```bash
brew install ollama

# Start service
ollama serve
```

## After Installation

### 1. Start Ollama Service

**Windows/Linux:**

```bash
ollama serve
```

Keep this terminal open! Or run it in the background.

**macOS:**
Ollama runs automatically after installation.

### 2. Download an AI Model

Open a new terminal:

```bash
# Default model (what CapybaraGPT uses)
ollama pull gpt-oss:20b

# Alternative models:
ollama pull llama3.1:8b     # 4.7GB - fast, good quality
ollama pull phi3:mini       # 2.3GB - very fast, basic
ollama pull deepseek-r1     # 8GB - advanced reasoning
```

**Note:** First download takes time (2GB-20GB depending on model).

### 3. Test It Works

```bash
# See what models you have
ollama list

# Test the model
ollama run gpt-oss:20b "Hello, how are you?"

# Check if Ollama is responding
curl http://localhost:11434/api/tags
```

## Troubleshooting

### "ollama: command not found" (Windows)

**Cause**: Ollama not in PATH or terminal not restarted

**Solution**:

1. Close all PowerShell/Terminal windows
2. Open a new PowerShell window
3. Try again: `ollama --version`
4. If still not found, reinstall Ollama

### "Error: Failed to download model"

**Cause**: Network issues or disk space

**Solution**:

```bash
# Check disk space (need 8-10GB free)
# Try again with better network connection
ollama pull deepseek-r1

# Or use smaller model
ollama pull phi3:mini
```

### "Error: Port 11434 already in use"

**Cause**: Ollama already running

**Solution**:

```powershell
# Windows - find and stop existing process
Get-Process ollama | Stop-Process

# Then restart
ollama serve
```

### "Cannot connect to Ollama server"

**Cause**: Ollama service not running

**Solution**:

```bash
# Start Ollama in a separate terminal
ollama serve

# Keep that terminal open!
```

### Model takes too long to respond

**Cause**: Large model or slow hardware

**Solution**:

```bash
# Use a smaller, faster model
ollama pull phi3:mini

# Then update backend/ollama_client.py:
# MODEL_NAME = "phi3:mini"
```

## Model Guide

| Model                     | Size  | Speed     | Quality   | Best For             | RAM Needed |
| ------------------------- | ----- | --------- | --------- | -------------------- | ---------- |
| **gpt-oss:20b** (default) | 14GB  | Medium    | Excellent | Production, accuracy | 16GB+      |
| **llama3.1:8b**           | 4.7GB | Fast      | Great     | Daily use, balanced  | 8GB+       |
| **phi3:mini**             | 2.3GB | Very Fast | Good      | Quick tasks, old PCs | 4GB+       |
| **deepseek-r1**           | 8GB   | Medium    | Excellent | Math, reasoning      | 16GB+      |

**To change models:** Edit `backend/ollama_client.py` and change `MODEL_NAME`

## Hardware Requirements

### Minimum

- **RAM**: 8GB
- **Disk**: 10GB free space
- **CPU**: Modern 4-core processor

### Recommended

- **RAM**: 16GB+
- **Disk**: 20GB+ free space (SSD preferred)
- **CPU**: 6+ cores
- **GPU**: Optional but speeds up significantly

## Running Ollama as a Service

### Windows (Background Service)

Ollama typically installs as a Windows service and starts automatically. Check with:

```powershell
Get-Service Ollama
```

### Linux (systemd)

```bash
# Create service file
sudo nano /etc/systemd/system/ollama.service

# Add:
[Unit]
Description=Ollama Service
After=network.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=your-username
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable ollama
sudo systemctl start ollama
sudo systemctl status ollama
```

## Next Steps

After installing Ollama:

```powershell
# 1. Verify installation
ollama --version

# 2. Start Ollama (keep running)
ollama serve

# 3. Download model (new terminal)
ollama pull gpt-oss:20b

# 4. Test it
ollama run gpt-oss:20b "Hello"

# 5. Return to CapybaraGPT
.\check-env.ps1
.\start.ps1
```

## Useful Commands

```bash
# List all models
ollama list

# Remove a model
ollama rm model-name

# Show model info
ollama show deepseek-r1

# Update a model
ollama pull deepseek-r1

# Stop Ollama (Ctrl+C in serve terminal)
# Or kill process if needed
```

## Getting Help

- **Official Docs**: https://github.com/ollama/ollama/blob/main/README.md
- **Model Library**: https://ollama.com/library
- **Search Models**: https://ollama.com/search
- **Discord**: https://discord.gg/ollama
- **GitHub Issues**: https://github.com/ollama/ollama/issues

---

**Once Ollama is installed and running, return to the main project and run `.\start.ps1`**
