# 📥 Ollama Installation Guide

## What is Ollama?

Ollama is a tool that lets you run large language models (LLMs) locally on your computer. It's required for this RAG Chatbot to work.

## Windows Installation

### Method 1: Official Installer (Recommended)

1. **Download Ollama**

   - Go to: https://ollama.com/download/windows
   - Click the "Download for Windows" button
   - The installer will download (OllamaSetup.exe, ~200MB)

2. **Run the Installer**

   - Double-click `OllamaSetup.exe`
   - Follow the installation wizard
   - It will install to `C:\Users\YourName\AppData\Local\Programs\Ollama`

3. **Verify Installation**

   ```powershell
   # Close and reopen PowerShell/Terminal
   ollama --version
   ```

   You should see something like: `ollama version is 0.x.x`

4. **Start Ollama Service**

   ```powershell
   ollama serve
   ```

   Keep this terminal window open! Ollama needs to run in the background.

5. **Pull DeepSeek-R1 Model** (in a new terminal)

   ```powershell
   ollama pull deepseek-r1
   ```

   This will download ~4-8GB depending on the model size. First time only!

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

### 2. Pull a Model

In a **new terminal window**:

```bash
# Recommended model (reasoning capabilities)
ollama pull deepseek-r1

# Alternative models:
ollama pull llama3:8b       # 4.7GB - balanced
ollama pull phi3:mini       # 2.3GB - fast & lightweight
ollama pull mistral         # 4.1GB - good alternative
```

**Note:** First pull will download several GB. Be patient!

### 3. Verify Everything Works

```bash
# List installed models
ollama list

# Test the model
ollama run deepseek-r1 "Hello, how are you?"

# Check API endpoint
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

## Model Recommendations

### DeepSeek-R1 (Default)

- **Size**: ~8GB
- **Best for**: Advanced reasoning, complex questions
- **Speed**: Moderate
- **RAM needed**: 16GB+ recommended

### LLaMA 3:8B

- **Size**: ~4.7GB
- **Best for**: General purpose, good balance
- **Speed**: Fast
- **RAM needed**: 8GB+

### Phi-3 Mini

- **Size**: ~2.3GB
- **Best for**: Quick responses, lower-end hardware
- **Speed**: Very fast
- **RAM needed**: 4GB+

### Mistral

- **Size**: ~4.1GB
- **Best for**: Creative writing, variety
- **Speed**: Fast
- **RAM needed**: 8GB+

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

1. ✅ Verify: `ollama --version`
2. ✅ Start service: `ollama serve`
3. ✅ Pull model: `ollama pull deepseek-r1`
4. ✅ Test: `ollama run deepseek-r1 "Hello"`
5. ✅ Return to project: `.\check-env.ps1`
6. ✅ Start chatbot: `.\start.ps1`

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
