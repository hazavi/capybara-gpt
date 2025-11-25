# 🤝 Contributing Guide

Want to improve the CapybaraGPT? Here's how to get started!

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

- [ ] Add message timestamps
- [ ] Add typing indicators
- [ ] Add loading skeletons
- [ ] Add keyboard shortcuts (Ctrl+K, etc.)
- [ ] Add export chat to markdown/PDF
- [ ] Add message search functionality
- [ ] Add voice input support
- [ ] Improve mobile responsiveness

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

- [ ] **Chat Organization**: Folders and tags for chats

  - Add folder/tag system in localStorage
  - Create UI for organizing chats
  - Add search and filter options

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

1. **Title**: Short, descriptive title (e.g., "AI stops responding after 30 seconds")
2. **Description**: What happened vs. what you expected
3. **Steps to Reproduce**: Clear steps to trigger the bug
4. **Environment**:
   - OS (Windows/Mac/Linux)
   - Python version (`python --version`)
   - Node version (`node --version`)
   - Ollama version (`ollama --version`)
   - Model being used
5. **Logs**: Copy relevant error messages from terminal/console
6. **Screenshots**: If UI-related, attach screenshots

## 💬 Feature Requests

Want a new feature?

1. Check if it already exists or is planned
2. Open an issue with clear description
3. Explain the use case
4. Provide examples if possible

## 🎨 UI/UX Improvements

For design changes:

1. **Design Philosophy**: Keep it clean, minimal, and modern (ChatGPT-inspired)
2. **Color System**: Use OKLCH color space variables (see `frontend/src/index.css`)
3. **Responsive Design**: Test on mobile (375px), tablet (768px), and desktop (1920px)
4. **Browser Testing**: Test on Chrome, Firefox, Safari, Edge
5. **Accessibility**: Follow WCAG 2.1 Level AA guidelines
6. **Tailwind CSS**: Use utility classes and custom theme variables
7. **Dark Mode**: Ensure all changes work in both light and dark themes
8. **Icons**: Use consistent icon style (currently using heroicons-style SVGs)

## 🔧 Common Development Tasks

### Add a New API Endpoint

```python
# backend/app.py
from fastapi import APIRouter

@app.get("/new-endpoint")
async def new_endpoint():
    """
    Endpoint description for auto-generated docs.
    """
    try:
        # Your logic here
        return {"message": "Success!", "data": {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
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

1. **Performance**: Optimize response times and resource usage
2. **User Experience**: Enhance UI/UX with modern features
3. **Documentation**: Add tutorials, guides, and examples
4. **Testing**: Add unit tests and integration tests
5. **Accessibility**: WCAG compliance and screen reader support
6. **Mobile Support**: Improve responsive design and touch interactions
7. **Export Features**: Save chats, export to different formats
8. **Advanced RAG**: Better document chunking and retrieval

## 🌟 Recognition

Contributors will be:

- Listed in CHANGELOG.md
- Credited in commit messages
- Appreciated by the community!

## 📚 Resources

### Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Backend framework
- [React Documentation](https://react.dev/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [Vite Documentation](https://vitejs.dev/) - Build tool

### AI/ML Stack

- [Ollama Documentation](https://ollama.com/docs) - LLM runtime
- [Ollama Model Library](https://ollama.com/library) - Available models
- [ChromaDB Docs](https://docs.trychroma.com/) - Vector database
- [Sentence Transformers](https://www.sbert.net/) - Embeddings

### Best Practices

- [RAG Best Practices](https://www.llamaindex.ai/blog/a-guide-to-retrieval-augmented-generation-rag) - RAG patterns
- [React Best Practices](https://react.dev/learn/thinking-in-react) - Component design
- [FastAPI Best Practices](https://github.com/zhanymkanov/fastapi-best-practices) - API design

## 🚀 Recent Updates

**Latest Features Implemented:**

- ✅ Dark/Light theme with OKLCH color system
- ✅ ChatGPT-style collapsible sidebar with icons
- ✅ Message editing and regeneration
- ✅ Stop generation button
- ✅ Copy to clipboard for all messages
- ✅ Code block syntax highlighting with copy button
- ✅ Model selector dropdown
- ✅ Memory toggle (temporary vs saved chats)
- ✅ GPU acceleration support
- ✅ Performance tuning options (documented in code)
- ✅ Streaming responses
- ✅ Chat history management

**Performance Notes:**

- All performance tuning options are documented in `backend/ollama_client.py` and `backend/rag.py`
- Look for 🎯 and ⚡ emoji comments in the code for customization points

## ❓ Questions?

- Check [README.md](../README.md) for setup and usage
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the codebase
- Read existing issues before opening new ones
- Open a discussion for feature ideas

---

**Thank you for contributing! Every improvement helps make this project better!** 🙏
