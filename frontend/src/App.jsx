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
  const [openMenuId, setOpenMenuId] = useState(null)
  const [renamingChatId, setRenamingChatId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [chatsCollapsed, setChatsCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState('general')
  const [personalization, setPersonalization] = useState(() => {
    const saved = localStorage.getItem('personalization')
    return saved ? JSON.parse(saved) : {
      baseStyle: 'default',
      concise: 'default',
      headers: 'default',
      warm: 'default',
      enthusiastic: 'default',
      formal: 'default',
      emoji: 'less'
    }
  })

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

  useEffect(() => {
    localStorage.setItem('personalization', JSON.stringify(personalization))
  }, [personalization])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const updatePersonalization = (key, value) => {
    setPersonalization(prev => ({ ...prev, [key]: value }))
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
    setOpenMenuId(null)
  }

  const renameChat = (chatId, newTitle) => {
    if (!newTitle.trim()) return
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat
    ))
    setRenamingChatId(null)
    setOpenMenuId(null)
  }

  const startRename = (chatId, currentTitle) => {
    setRenamingChatId(chatId)
    setRenameValue(currentTitle)
    setOpenMenuId(null)
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
  
  // Check if current chat has any messages (to lock the memory toggle)
  const currentChatHasMessages = currentChat && currentChat.messages && currentChat.messages.length > 0

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId && !e.target.closest('.group')) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openMenuId])

  return (
    <div className="h-screen flex bg-white dark:bg-[#0a0a0a] transition-colors">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-12'} flex-shrink-0 border-r border-border bg-sidebar transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className={`p-3 border-sidebar-border ${!sidebarOpen && 'flex justify-center'}`}>
          <button
            onClick={createNewChat}
            className={`flex items-center justify-center gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80 rounded-lg transition-all text-sm font-medium text-sidebar-accent-foreground shadow-sm ${
              sidebarOpen ? 'w-full px-4 py-3' : 'p-3'
            }`}
            title={!sidebarOpen ? "New Chat" : ""}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {sidebarOpen && <span>New Chat</span>}
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3">
          {sidebarOpen && (
            <button 
              onClick={() => setChatsCollapsed(!chatsCollapsed)}
              className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground px-2 py-2 mb-2 hover:text-sidebar-foreground rounded-md transition-colors"
            >
              <span>RECENT</span>
              <svg 
                className={`w-3 h-3 transition-transform ${chatsCollapsed ? '-rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          
          {sidebarOpen && !chatsCollapsed && chatHistory.filter(chat => chat.messages.length > 0).map(chat => (
            <div key={chat.id} className="relative group">
              {renamingChatId === chat.id ? (
                <div className="px-3 py-2 mb-1">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        renameChat(chat.id, renameValue)
                      } else if (e.key === 'Escape') {
                        setRenamingChatId(null)
                      }
                    }}
                    onBlur={() => renameChat(chat.id, renameValue)}
                    autoFocus
                    className="w-full px-2 py-1 text-sm bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <button
                  onClick={() => loadChat(chat.id)}
                  className={`w-full flex items-center gap-2 rounded-lg mb-1 text-sm transition-all relative group/item px-3 py-2.5 text-left ${
                    currentChatId === chat.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'
                  }`}
                >
                  <div className="truncate pr-8 flex-1">{chat.title}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(openMenuId === chat.id ? null : chat.id)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 p-1.5 hover:bg-sidebar-accent rounded-md transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <circle cx="2" cy="8" r="1.5"/>
                      <circle cx="8" cy="8" r="1.5"/>
                      <circle cx="14" cy="8" r="1.5"/>
                    </svg>
                  </button>
                </button>
              )}
              
              {/* Dropdown Menu */}
              {openMenuId === chat.id && (
                <div className="absolute right-2 top-full mt-1 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg shadow-lg z-50 py-1">
                  <button
                    onClick={() => startRename(chat.id, chat.title)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222222] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Rename
                  </button>
                  <button
                    onClick={() => deleteChat(chat.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#222222] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Settings Button at Bottom */}
        <div className={`p-3 border-sidebar-border ${!sidebarOpen && 'flex justify-center'}`}>
          <button
            onClick={() => setSettingsOpen(true)}
            className={`flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all text-sm ${
              sidebarOpen ? 'w-full px-3 py-3' : 'p-3'
            }`}
            title={!sidebarOpen ? "Settings" : ""}
          >
            <svg className={`${sidebarOpen ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSettingsOpen(false)}>
          <div className="bg-white dark:bg-[#0d0d0d] rounded-xl shadow-2xl w-[900px] h-[600px] flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Settings Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-[#111111] border-r border-gray-200 dark:border-[#1a1a1a] p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
                <button onClick={() => setSettingsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setSettingsTab('general')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settingsTab === 'general'
                      ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  General
                </button>
                <button
                  onClick={() => setSettingsTab('personalization')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settingsTab === 'personalization'
                      ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personalization
                </button>
              </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {settingsTab === 'general' && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">General</h3>
                  
                  <div className="space-y-6">
                    {/* Appearance */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Appearance</div>
                      </div>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Language</div>
                      </div>
                      <select className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Auto-detect</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'personalization' && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Personalization</h3>
                  
                  <div className="space-y-6">
                    {/* Base style and tone */}
                    <div className="pb-4 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Base style and tone</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set the style and tone of how CapybaraGPT responds to you.</div>
                        </div>
                        <select
                          value={personalization.baseStyle}
                          onChange={(e) => updatePersonalization('baseStyle', e.target.value)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="default">Default</option>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                        </select>
                      </div>
                    </div>

                    {/* Concise */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div className="text-sm text-gray-900 dark:text-white">Concise</div>
                      <select
                        value={personalization.concise}
                        onChange={(e) => updatePersonalization('concise', e.target.value)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="more">More</option>
                        <option value="less">Less</option>
                      </select>
                    </div>

                    {/* Headers & Lists */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div className="text-sm text-gray-900 dark:text-white">Headers & Lists</div>
                      <select
                        value={personalization.headers}
                        onChange={(e) => updatePersonalization('headers', e.target.value)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="more">More</option>
                        <option value="less">Less</option>
                      </select>
                    </div>

                    {/* Warm */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div className="text-sm text-gray-900 dark:text-white">Warm</div>
                      <select
                        value={personalization.warm}
                        onChange={(e) => updatePersonalization('warm', e.target.value)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="more">More</option>
                        <option value="less">Less</option>
                      </select>
                    </div>

                    {/* Enthusiastic */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div className="text-sm text-gray-900 dark:text-white">Enthusiastic</div>
                      <select
                        value={personalization.enthusiastic}
                        onChange={(e) => updatePersonalization('enthusiastic', e.target.value)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="more">More</option>
                        <option value="less">Less</option>
                      </select>
                    </div>

                    {/* Formal */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div className="text-sm text-gray-900 dark:text-white">Formal</div>
                      <select
                        value={personalization.formal}
                        onChange={(e) => updatePersonalization('formal', e.target.value)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="more">More</option>
                        <option value="less">Less</option>
                      </select>
                    </div>

                    {/* Emoji */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#1a1a1a]">
                      <div className="text-sm text-gray-900 dark:text-white">Emoji</div>
                      <select
                        value={personalization.emoji}
                        onChange={(e) => updatePersonalization('emoji', e.target.value)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="less">Less</option>
                        <option value="default">Default</option>
                        <option value="more">More</option>
                      </select>
                    </div>

                    {/* Custom instructions */}
                    <div className="pt-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Custom instructions</div>
                      <textarea
                        placeholder="Additional behavior, style, and tone preferences"
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">CapybaraGPT</h1>
              {isMemoryFull && (
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded">
                  Memory Full
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Temporary Chat Toggle */}
              <button
                onClick={() => !currentChatHasMessages && setSaveToMemory(!saveToMemory)}
                disabled={currentChatHasMessages}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentChatHasMessages
                    ? saveToMemory
                      ? 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-60'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed opacity-60'
                    : saveToMemory
                      ? 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#222222] cursor-pointer'
                      : 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 cursor-pointer'
                }`}
                title={
                  currentChatHasMessages
                    ? 'Cannot change memory setting once conversation has started'
                    : saveToMemory 
                      ? 'Conversations are saved' 
                      : 'Temporary chat - not saved'
                }
              >
                {saveToMemory ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Temporary chat</span>
                  </>
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
            personalization={personalization}
          />
        </main>
      </div>
    </div>
  )
}

export default App
