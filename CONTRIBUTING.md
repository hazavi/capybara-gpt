# 🤝 Contributing Guide

Want to improve the RAG Chatbot? Here's how to get started!

## 🚀 Quick Contribution Guide

### 1. Setup Development Environment

```bash
# Clone/fork the repository
git clone <your-repo-url>
cd capybara-v2

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Run environment check
cd ..
.\check-env.ps1
```

### 2. Make Your Changes

See the "Ideas for Contribution" section below for suggestions!

### 3. Test Your Changes

```bash
# Start the application
.\start.ps1

# Test manually at http://localhost:3000
# Test API at http://localhost:8000/docs
```

### 4. Submit Your Work

```bash
git add .
git commit -m "Description of your changes"
git push origin your-branch-name
```

## 💡 Ideas for Contribution

### Easy (Good for Beginners)

#### Frontend Improvements

- [ ] Add dark mode toggle
- [ ] Add copy-to-clipboard for messages
- [ ] Add message timestamps
- [ ] Add typing indicators
- [ ] Improve error messages
- [ ] Add loading skeletons
- [ ] Add keyboard shortcuts (Ctrl+K, etc.)
- [ ] Add message markdown rendering

#### Backend Improvements

- [ ] Add health check endpoint
- [ ] Add document preview endpoint
- [ ] Add search within documents
- [ ] Better error handling
- [ ] Add logging
- [ ] Add request validation

#### Documentation

- [ ] Add video walkthrough
- [ ] Add more examples
- [ ] Translate to other languages
- [ ] Add FAQ section
- [ ] Add deployment guides (AWS, Azure, etc.)

### Medium (Some Experience Required)

#### Features

- [ ] **Streaming Responses**: Real-time token streaming

  - Update `ollama_client.py` to support streaming
  - Modify `Chat.jsx` to handle SSE events
  - Update `/ask` endpoint for EventSource

- [ ] **Chat History**: Save/load conversations

  - Add SQLite database
  - Create history API endpoints
  - Add history UI in frontend

- [ ] **Multi-document Chat**: Chat with specific documents

  - Add document filtering in RAG
  - Update UI to select documents
  - Modify retrieval logic

- [ ] **Advanced Chunking**: Better document splitting

  - Implement semantic chunking
  - Add paragraph-aware splitting
  - Preserve document structure

- [ ] **Multiple File Upload**: Upload multiple files at once
  - Update Upload.jsx for multi-select
  - Modify backend to handle batch upload
  - Add progress indicators

### Advanced (Experienced Developers)

#### Architecture Improvements

- [ ] **Hybrid Search**: Combine semantic + keyword search

  - Implement BM25 for keyword search
  - Combine scores from both methods
  - Add search strategy configuration

- [ ] **Multi-user Support**: Different users, different knowledge bases

  - Add authentication (JWT/OAuth)
  - Create user-specific collections
  - Add user management

- [ ] **Advanced RAG**: Re-ranking, query expansion

  - Implement cross-encoder re-ranking
  - Add query expansion/rephrasing
  - Implement HyDE (Hypothetical Document Embeddings)

- [ ] **Model Management**: Switch models via UI

  - Add model selection in backend
  - Create model management UI
  - Support multiple embedding models

- [ ] **Caching Layer**: Redis for faster responses

  - Add Redis for query caching
  - Cache embeddings
  - Implement cache invalidation

- [ ] **Observability**: Monitoring and metrics
  - Add Prometheus metrics
  - Implement request tracing
  - Add performance monitoring dashboard

## 🏗️ Architecture Guidelines

### Backend (Python/FastAPI)

**File Organization**:

```
backend/
├── app.py           # API routes
├── rag.py           # RAG logic
├── ollama_client.py # LLM client
├── docs_loader.py   # Document processing
└── models.py        # Pydantic models (if needed)
```

**Code Style**:

- Use type hints: `def function(param: str) -> dict:`
- Use docstrings for functions
- Follow PEP 8
- Use async/await for I/O operations

**Testing**:

```python
# Add tests in backend/tests/
import pytest

def test_chunk_text():
    from docs_loader import chunk_text
    text = "a" * 1000
    chunks = chunk_text(text, chunk_size=500, overlap=100)
    assert len(chunks) > 1
```

### Frontend (React/JavaScript)

**Component Structure**:

```
src/
├── components/     # Reusable components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── styles/         # Additional styles
```

**Code Style**:

- Use functional components
- Use hooks (useState, useEffect, etc.)
- Keep components small and focused
- Use meaningful variable names
- Add PropTypes or TypeScript

**Example Component**:

```jsx
function MessageItem({ message, onDelete }) {
  return (
    <div className="message">
      <p>{message.content}</p>
      <button onClick={() => onDelete(message.id)}>Delete</button>
    </div>
  );
}
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pip install pytest pytest-asyncio
pytest
```

### Frontend Tests

```bash
cd frontend
npm install --save-dev @testing-library/react vitest
npm test
```

### API Tests

```bash
# Test with curl
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"text": "test question"}'
```

## 📝 Code Review Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] No console.log or debug prints
- [ ] Error handling added
- [ ] Comments for complex logic
- [ ] Updated documentation if needed
- [ ] Tested manually
- [ ] No breaking changes (or documented)

## 🐛 Bug Reports

Found a bug? Open an issue with:

1. **Title**: Short description
2. **Description**: What happened vs. what you expected
3. **Steps to Reproduce**: How to trigger the bug
4. **Environment**: OS, Python version, Node version
5. **Logs**: Relevant error messages

## 💬 Feature Requests

Want a new feature?

1. Check if it already exists or is planned
2. Open an issue with clear description
3. Explain the use case
4. Provide examples if possible

## 🎨 UI/UX Improvements

For design changes:

1. Keep the current aesthetic (clean, minimal)
2. Ensure mobile responsiveness
3. Test on multiple browsers
4. Consider accessibility (WCAG guidelines)
5. Use Tailwind CSS utilities when possible

## 🔧 Common Development Tasks

### Add a New API Endpoint

```python
# backend/app.py
@app.get("/new-endpoint")
def new_endpoint():
    return {"message": "Hello!"}
```

### Add a New Component

```jsx
// frontend/src/NewComponent.jsx
function NewComponent() {
  return <div>New Component</div>;
}

export default NewComponent;
```

### Add a New Dependency

```bash
# Backend
cd backend
pip install package-name
pip freeze > requirements.txt

# Frontend
cd frontend
npm install package-name
```

### Update Documentation

```bash
# Edit the relevant .md file
# Update README.md if major changes
# Update CHANGELOG.md with your changes
```

## 🎯 Priority Areas

We especially welcome contributions in:

1. **Performance**: Make it faster!
2. **User Experience**: Make it better!
3. **Documentation**: Make it clearer!
4. **Testing**: Make it more reliable!
5. **Accessibility**: Make it available to everyone!

## 🌟 Recognition

Contributors will be:

- Listed in CHANGELOG.md
- Credited in commit messages
- Appreciated by the community!

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [ChromaDB Docs](https://docs.trychroma.com/)
- [Ollama Documentation](https://ollama.com/docs)

## ❓ Questions?

- Check existing issues
- Read the documentation
- Ask in discussions (if available)

---

**Thank you for contributing! Every improvement helps!** 🙏
