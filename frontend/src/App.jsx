import { useState, useEffect } from 'react'
import Chat from './Chat'

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'dark'
  })
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('chatHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [currentChatId, setCurrentChatId] = useState(null)
  const [saveToMemory, setSaveToMemory] = useState(() => {
    const saved = localStorage.getItem('saveToMemory')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  useEffect(() => {
    localStorage.setItem('saveToMemory', JSON.stringify(saveToMemory))
  }, [saveToMemory])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const createNewChat = () => {
    const newChatId = Date.now().toString()
    // Don't add to history yet - will be added when first message is sent
    setCurrentChatId(newChatId)
  }

  const loadChat = (chatId) => {
    setCurrentChatId(chatId)
  }

  const updateChatMessages = (chatId, messages) => {
    if (!saveToMemory) return
    
    // If messages are empty, remove chat from history
    if (messages.length === 0) {
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
      return
    }
    
    setChatHistory(prev => {
      const existingChat = prev.find(chat => chat.id === chatId)
      
      if (existingChat) {
        // Update existing chat
        return prev.map(chat => {
          if (chat.id === chatId) {
            // Generate title from first user message if still "New Chat"
            let title = chat.title
            if (title === 'New Chat' && messages.length > 0) {
              const firstUserMsg = messages.find(m => m.role === 'user')
              if (firstUserMsg) {
                title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '')
              }
            }
            return {
              ...chat,
              messages,
              title,
              updatedAt: Date.now()
            }
          }
          return chat
        })
      } else {
        // Add new chat to history on first message
        const firstUserMsg = messages.find(m => m.role === 'user')
        const title = firstUserMsg 
          ? firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '')
          : 'New Chat'
        
        const newChat = {
          id: chatId,
          title,
          messages,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        return [newChat, ...prev]
      }
    })
  }

  const deleteChat = (chatId) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(null)
    }
  }

  const getCurrentChat = () => {
    if (!currentChatId) return null
    return chatHistory.find(chat => chat.id === currentChatId)
  }

  const handleUploadSuccess = () => {
    // Trigger any upload-related updates if needed
  }

  const currentChat = getCurrentChat()
  const memoryUsage = chatHistory.reduce((acc, chat) => acc + chat.messages.length, 0)
  const isMemoryFull = memoryUsage > 100

  return (
    <div className="h-screen flex bg-white dark:bg-[#0a0a0a] transition-colors">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 border-r border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-3 border-b border-gray-200 dark:border-[#1a1a1a]">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>

        {/* Memory Settings */}
        <div className="p-3 border-b border-gray-200 dark:border-[#1a1a1a]">
          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span className="text-gray-600 dark:text-gray-400">Save to memory</span>
            <input
              type="checkbox"
              checked={saveToMemory}
              onChange={(e) => setSaveToMemory(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </label>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">Chats</div>
          {chatHistory.filter(chat => chat.messages.length > 0).map(chat => (
            <button
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors group relative ${
                currentChatId === chat.id
                  ? 'bg-gray-200 dark:bg-[#1a1a1a] text-gray-900 dark:text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="truncate pr-6">{chat.title}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteChat(chat.id)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 dark:hover:bg-[#222222] rounded transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] transition-colors">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <img src="/capybara.png" alt="Capybara Logo" className="w-8 h-8 object-contain" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">RAG Chatbot</h1>
              {isMemoryFull && (
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded">
                  Memory Full
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Connected</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden">
          <Chat 
            theme={theme}
            currentChat={currentChat}
            currentChatId={currentChatId}
            onMessagesUpdate={updateChatMessages}
            onUploadSuccess={handleUploadSuccess}
            saveToMemory={saveToMemory}
          />
        </main>
      </div>
    </div>
  )
}

export default App
