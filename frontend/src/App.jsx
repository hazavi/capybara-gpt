import { useState } from 'react'
import Chat from './Chat'

function App() {
  const [uploadCount, setUploadCount] = useState(0)

  const handleUploadSuccess = () => {
    setUploadCount(prev => prev + 1)
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">RAG Chatbot</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span>Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Chat key={uploadCount} onUploadSuccess={handleUploadSuccess} />
      </main>
    </div>
  )
}

export default App
