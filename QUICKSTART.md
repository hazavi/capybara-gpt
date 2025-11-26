# Quick Start Guide

Get running in 3 minutes.

---

## What You Need

- Python 3.11 or newer
- Node.js 18 or newer
- 8GB memory (RAM)

---

## Setup Steps

### 1. Install Ollama

Download from [ollama.com](https://ollama.com), then:

```bash
ollama pull llama3.1
ollama serve
```

Keep this terminal open.

### 2. Start Application

New terminal:

```powershell
.\start.ps1
```

Wait for "Server started" messages.

### 3. Open Browser

**http://localhost:3000**

Done! Start chatting or click **+** to upload documents.

---

## Troubleshooting

**Ollama not responding?**

```bash
ollama serve
```

**Port conflict?**

```powershell
.\check-env.ps1
```

**Model issues?**

```bash
ollama list
```

---

## What's Next?

See [README.md](README.md) for:

- All features and capabilities
- Model selection guide
- Performance tuning
- Document mode instructions

See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for detailed help.
