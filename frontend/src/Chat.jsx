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
  const [attachedFiles, setAttachedFiles] = useState([])
  const [editingMessageIndex, setEditingMessageIndex] = useState(null)
  const [editingContent, setEditingContent] = useState('')
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
    // Add file to attached files display
    const fileObj = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading'
    }
    setAttachedFiles(prev => [...prev, fileObj])
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/upload', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')
      
      // Update file status to uploaded
      setAttachedFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'uploaded' } : f
      ))
      
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      // Update file status to error
      setAttachedFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'error' } : f
      ))
    }
  }

  const removeAttachedFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      // Add a message indicating the response was stopped
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Response generation stopped by user.'
      }])
    }
  }

  const startEditMessage = (index, content) => {
    setEditingMessageIndex(index)
    setEditingContent(content)
  }

  const cancelEdit = () => {
    setEditingMessageIndex(null)
    setEditingContent('')
  }

  const saveEditedMessage = async () => {
    if (!editingContent.trim() || editingMessageIndex === null) return

    // Remove all messages after the edited one
    const updatedMessages = messages.slice(0, editingMessageIndex)
    setMessages(updatedMessages)
    setEditingMessageIndex(null)
    
    // Add the edited user message
    const newMessages = [...updatedMessages, { 
      role: 'user', 
      content: editingContent.trim()
    }]
    setMessages(newMessages)
    setEditingContent('')
    
    // Generate new response
    setIsLoading(true)
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
          text: editingContent.trim(),
          stream: false,
          history: updatedMessages,
          personalization: personalizationPrompt,
          model: selectedModel
        }),
        signal: abortController.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'No response received.'
      }])
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted')
        setMessages(prev => prev.slice(0, -1))
        return
      }
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ **Error**: Failed to get response. Please try again.'
      }])
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const regenerateResponse = async (index) => {
    // Remove the assistant message and all after it
    const messagesUpToUser = messages.slice(0, index)
    setMessages(messagesUpToUser)
    
    // Get the user message that prompted this response
    const userMessage = messages[index - 1]
    if (!userMessage || userMessage.role !== 'user') return

    setIsLoading(true)
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const personalizationPrompt = buildPersonalizationPrompt()
      const historyBeforeUser = messagesUpToUser.slice(0, -1)
      
      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage.content,
          stream: false,
          history: historyBeforeUser,
          personalization: personalizationPrompt,
          model: selectedModel
        }),
        signal: abortController.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'No response received.'
      }])
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted')
        return
      }
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ **Error**: Failed to get response. Please try again.'
      }])
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return

    const userMessage = input.trim() || 'Summarize or analyze the attached document'
    setInput('')
    
    // Add user message with attachments
    const newMessages = [...messages, { 
      role: 'user', 
      content: userMessage,
      attachments: attachedFiles.filter(f => f.status === 'uploaded').map(f => ({
        name: f.name,
        type: f.type
      }))
    }]
    setMessages(newMessages)
    
    // Clear attachments after sending
    setAttachedFiles([])
    
    setIsLoading(true)

    // Create abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const personalizationPrompt = buildPersonalizationPrompt()
      
      // Add context about uploaded documents if there were attachments
      let messageWithContext = userMessage
      if (newMessages[newMessages.length - 1].attachments && newMessages[newMessages.length - 1].attachments.length > 0) {
        const fileNames = newMessages[newMessages.length - 1].attachments.map(f => f.name).join(', ')
        messageWithContext = `I have uploaded the following document(s): ${fileNames}. ${userMessage}`
      }
      
      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: messageWithContext,
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
        // Remove the user message that was just added
        setMessages(prev => prev.slice(0, -1))
        return
      }
      console.error('Error:', error)
      // Add error message as assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ **Error**: Failed to get response. This could be due to:\n\n' +
                 '- Ollama taking too long to respond (timeout)\n' +
                 '- Ollama service not running\n' +
                 '- Backend server connection issue\n\n' +
                 '**Try:**\n' +
                 '1. Make sure Ollama is running: `ollama serve`\n' +
                 '2. Check if the model is available: `ollama list`\n' +
                 '3. Try asking a simpler question\n' +
                 '4. Wait a moment and try again'
      }])
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
                    <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">Create a new chat to start</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Click "New chat" in the sidebar</p>
                  </>
                ) : (
                  <>
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
              const isEditing = editingMessageIndex === index
              
              return (
                <div
                  key={index}
                  className={`message group flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {isEditing ? (
                    <div className="w-full max-w-3xl space-y-3 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] rounded-xl shadow-sm p-4">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={6}
                        autoFocus
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 text-sm bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEditedMessage}
                          disabled={!editingContent.trim()}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-[#1a1a1a] disabled:cursor-not-allowed transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`max-w-[85%] rounded-xl shadow-sm ${
                          message.role === 'user'
                            ? 'bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222]'
                            : 'bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222]'
                        }`}
                      >
                    {/* Show attachments for user messages */}
                    {message.role === 'user' && message.attachments && message.attachments.length > 0 && (
                      <div className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-[#222222]">
                        {message.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg mb-2 last:mb-0">
                            <div className="w-8 h-8 flex items-center justify-center bg-red-500 rounded">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{file.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {file.type.includes('pdf') ? 'PDF' : file.type.includes('text') ? 'TXT' : 'MD'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="px-4 py-3">
                      {messageParts.map((part, partIndex) => {
                        if (part.type === 'code') {
                          return (
                            <div key={partIndex} className="my-3 relative group/code">
                              <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg text-xs ${
                                theme === 'dark' 
                                  ? 'bg-[#1a1a1a] text-gray-100' 
                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                <span className={`font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{part.language}</span>
                                <button
                                  onClick={() => copyToClipboard(part.content, `${index}-${partIndex}`)}
                                  className={`opacity-0 group-hover/code:opacity-100 transition-opacity px-2 py-1 rounded text-xs flex items-center gap-1 ${
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
                  {/* Action buttons outside the bubble */}
                  {!isLoading && (
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {message.role === 'user' ? (
                        <>
                          <button
                            onClick={() => copyToClipboard(message.content, `msg-${index}`)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
                            title="Copy"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          {index === messages.length - 2 && (
                            <button
                              onClick={() => startEditMessage(index, message.content)}
                              className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
                              title="Edit message"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => copyToClipboard(message.content, `msg-${index}`)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
                            title="Copy"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          {index === messages.length - 1 && (
                            <button
                              onClick={() => regenerateResponse(index)}
                              className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
                              title="Regenerate response"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
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
          {/* Attached Files Display */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-8 h-8 flex items-center justify-center rounded ${
                      file.status === 'uploaded' ? 'bg-green-500' :
                      file.status === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}>
                      {file.status === 'uploading' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : file.status === 'uploaded' ? (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {file.status === 'uploading' ? 'Uploading...' :
                         file.status === 'uploaded' ? 'Uploaded' :
                         file.status === 'error' ? 'Upload failed' :
                         file.type.includes('pdf') ? 'PDF' : file.type.includes('text') ? 'TXT' : 'MD'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(file.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-[#222222] rounded transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
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
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none px-3 py-3 pr-8 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all cursor-pointer hover:border-ring/50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Select AI model"
                disabled={availableModels.length === 0}
              >
                {availableModels.length === 0 ? (
                  <option>Loading...</option>
                ) : (
                  availableModels.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name.split(':')[0]}
                    </option>
                  ))
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {isLoading ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all"
                title="Stop generation"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-[#1a1a1a] disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            )}
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
    </div>
  )
}

export default Chat
