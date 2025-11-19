import { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
})

function Chat({ theme, currentChat, currentChatId, onMessagesUpdate, onUploadSuccess, saveToMemory, personalization }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [availableModels, setAvailableModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('selectedModel') || ''
  })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const abortControllerRef = useRef(null)
  const previousChatIdRef = useRef(null)

  // Load messages when currentChatId changes (switching chats)
  useEffect(() => {
    // Only reset messages if we're actually switching to a different chat
    if (previousChatIdRef.current !== currentChatId) {
      console.log('Chat switched from', previousChatIdRef.current, 'to', currentChatId)
      
      // Abort any ongoing request when switching chats
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
        setIsLoading(false)
      }
      
      // Clear messages first
      setMessages([])
      
      // Then load messages from history if this is an existing chat
      if (currentChat && currentChat.messages && currentChat.messages.length > 0) {
        console.log('Loading', currentChat.messages.length, 'messages from history')
        setMessages(currentChat.messages)
      }
      
      previousChatIdRef.current = currentChatId
    }
  }, [currentChatId, currentChat])

  // Update parent when messages change
  useEffect(() => {
    if (currentChatId && saveToMemory && messages.length > 0) {
      onMessagesUpdate(currentChatId, messages)
    }
  }, [messages, currentChatId, saveToMemory])

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/models')
        if (response.ok) {
          const data = await response.json()
          setAvailableModels(data.models || [])
          // Set default model if none selected
          if (!selectedModel && data.models && data.models.length > 0) {
            setSelectedModel(data.models[0].name)
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    }
    fetchModels()
  }, [])

  // Save selected model to localStorage
  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('selectedModel', selectedModel)
    }
  }, [selectedModel])

  // Save selected model to localStorage
  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('selectedModel', selectedModel)
    }
  }, [selectedModel])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const buildPersonalizationPrompt = () => {
    if (!personalization) return ''
    
    const prompts = []
    
    // Base style
    if (personalization.baseStyle !== 'default') {
      prompts.push(`Use a ${personalization.baseStyle} writing style.`)
    }
    
    // Conciseness
    if (personalization.concise === 'more') {
      prompts.push('Be very concise and brief in your responses.')
    } else if (personalization.concise === 'less') {
      prompts.push('Provide detailed and comprehensive explanations.')
    }
    
    // Headers & Lists
    if (personalization.headers === 'more') {
      prompts.push('Use more headers, bullet points, and structured formatting.')
    } else if (personalization.headers === 'less') {
      prompts.push('Use fewer headers and lists, prefer paragraph format.')
    }
    
    // Warm
    if (personalization.warm === 'more') {
      prompts.push('Be warm, friendly, and personable in your tone.')
    } else if (personalization.warm === 'less') {
      prompts.push('Maintain a neutral and straightforward tone.')
    }
    
    // Enthusiastic
    if (personalization.enthusiastic === 'more') {
      prompts.push('Be enthusiastic and energetic in your responses.')
    } else if (personalization.enthusiastic === 'less') {
      prompts.push('Keep responses calm and measured.')
    }
    
    // Formal
    if (personalization.formal === 'more') {
      prompts.push('Use formal language and professional terminology.')
    } else if (personalization.formal === 'less') {
      prompts.push('Use casual and conversational language.')
    }
    
    // Emoji
    if (personalization.emoji === 'more') {
      prompts.push('Use emojis frequently to add expression.')
    } else if (personalization.emoji === 'less') {
      prompts.push('Minimize or avoid using emojis.')
    }
    
    return prompts.length > 0 ? '\nPersonalization preferences: ' + prompts.join(' ') : ''
  }

  const parseMessageContent = (content) => {
    // Split by code blocks (```...```)
    const parts = []
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block (render as markdown)
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index).trim()
        if (textContent) {
          parts.push({ type: 'markdown', content: textContent })
        }
      }
      // Add code block
      parts.push({ 
        type: 'code', 
        language: match[1] || 'text', 
        content: match[2].trim() 
      })
      lastIndex = match.index + match[0].length
    }

    // Add remaining text (render as markdown)
    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex).trim()
      if (textContent) {
        parts.push({ type: 'markdown', content: textContent })
      }
    }

    return parts.length > 0 ? parts : [{ type: 'markdown', content }]
  }

  const handleFileUpload = async (file) => {
    setUploadStatus('uploading')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/upload', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')
      setUploadStatus('success')
      setTimeout(() => setUploadStatus(null), 3000)
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      setUploadStatus('error')
      setTimeout(() => setUploadStatus(null), 3000)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    // Create abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const personalizationPrompt = buildPersonalizationPrompt()
      
      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage,
          stream: false,
          history: messages,
          personalization: personalizationPrompt,
          model: selectedModel
        }),
        signal: abortController.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Add assistant message with complete response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'No response received.'
      }])
    } catch (error) {
      // Don't show error if request was aborted (user switched chats)
      if (error.name === 'AbortError') {
        console.log('Request aborted - user switched chats')
        // Remove the empty assistant message
        setMessages(prev => prev.slice(0, -1))
        return
      }
      console.error('Error:', error)
      setMessages(prev => {
        const updated = [...prev]
        updated[assistantIndex] = {
          role: 'assistant',
          content: '❌ Error: Failed to get response. Make sure Ollama is running and the backend server is accessible.'
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    if (currentChatId) {
      setMessages([])
      // Notify parent to remove from history when cleared
      if (onMessagesUpdate) {
        onMessagesUpdate(currentChatId, [])
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] transition-colors">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {messages.length === 0 ? (
            <div className="h-[60vh] flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-500">
                {!currentChatId ? (
                  <>
                    <div className="text-5xl mb-4">💬</div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">Create a new chat to start</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Click "New chat" in the sidebar</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">💬</div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">How can I help you today?</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Ask me anything about your documents</p>
                  </>
                )}
              </div>
            </div>
          ) : (
          <>
            {messages.map((message, index) => {
              const messageParts = parseMessageContent(message.content)
              
              return (
                <div
                  key={index}
                  className={`message flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl shadow-sm ${
                      message.role === 'user'
                        ? 'bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222]'
                        : 'bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222]'
                    }`}
                  >
                    <div className="px-4 py-3">
                      {messageParts.map((part, partIndex) => {
                        if (part.type === 'code') {
                          return (
                            <div key={partIndex} className="my-3 group relative">
                              <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg text-xs ${
                                theme === 'dark' 
                                  ? 'bg-[#1a1a1a] text-gray-100' 
                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                <span className={`font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{part.language}</span>
                                <button
                                  onClick={() => copyToClipboard(part.content, `${index}-${partIndex}`)}
                                  className={`opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                    theme === 'dark'
                                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                                  }`}
                                >
                                  {copiedIndex === `${index}-${partIndex}` ? (
                                    <>✓ Copied</>
                                  ) : (
                                    <>Copy</>
                                  )}
                                </button>
                              </div>
                              <pre className={`p-4 rounded-b-lg overflow-x-auto ${
                                theme === 'dark'
                                  ? 'bg-[#0d0d0d]'
                                  : 'bg-white border border-t-0 border-gray-200'
                              }`}>
                                <code className={`font-mono text-sm leading-relaxed ${
                                  theme === 'dark'
                                    ? 'text-[#e6e6e6]'
                                    : 'text-gray-800'
                                }`} style={theme === 'dark' ? {
                                  textShadow: '0 0 1px rgba(100, 200, 255, 0.3)'
                                } : {}}>{part.content}</code>
                              </pre>
                            </div>
                          )
                        } else if (part.type === 'markdown') {
                          return (
                            <div 
                              key={partIndex} 
                              className={`prose prose-sm max-w-none ${
                                theme === 'dark' ? 'prose-invert' : 'prose-gray'
                              }`}
                              dangerouslySetInnerHTML={{ __html: marked(part.content) }}
                            />
                          )
                        } else {
                          return (
                            <div 
                              key={partIndex} 
                              className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200"
                            >
                              {part.content}
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] rounded-xl shadow-sm px-5 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Thinking</span>
                    <div className="flex gap-0.5">
                      <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}>.</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}>.</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}>.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-100 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] px-4 py-4 transition-colors">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('file-upload-hidden').click()}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
              title="Upload document"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anytihing"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#2a2a2a] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#2a2a2a] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              title="Select AI model"
              disabled={availableModels.length === 0}
            >
              {availableModels.length === 0 ? (
                <option>Loading models...</option>
              ) : (
                availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))
              )}
            </select>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-[#1a1a1a] disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
          {messages.length > 0 && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={clearChat}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Clear conversation
              </button>
            </div>
          )}
        </div>
        <input
          id="file-upload-hidden"
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0]
            if (file) {
              handleFileUpload(file)
              e.target.value = ''
            }
          }}
        />
      </div>
      {uploadStatus && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg text-sm ${
            uploadStatus === 'success' ? 'bg-green-500 text-white' : 
            uploadStatus === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
          }`}>
            {uploadStatus === 'success' ? '✓ Document uploaded' : 
             uploadStatus === 'error' ? '✗ Upload failed' : 
             'Uploading...'}
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
