import { useState, useRef } from 'react'

function Upload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [documents, setDocuments] = useState(null)
  const fileInputRef = useRef(null)

  const loadDocuments = async () => {
    try {
      const response = await fetch('/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  useState(() => {
    loadDocuments()
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (['pdf', 'txt', 'md'].includes(ext)) {
        setSelectedFile(file)
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: 'Please select a PDF, TXT, or MD file' })
        setSelectedFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await response.json()
      setMessage({ 
        type: 'success', 
        text: `✅ ${data.message} (${data.chunks} chunks created)` 
      })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Reload documents list
      await loadDocuments()
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message}. Make sure the backend server is running.` 
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all documents from the knowledge base?')) {
      return
    }

    try {
      const response = await fetch('/documents', {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ All documents cleared' })
        await loadDocuments()
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error clearing documents: ${error.message}` })
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600 mb-6">
          Upload PDF, TXT, or Markdown files to add them to the knowledge base.
        </p>

        <div className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-blue-500 hover:text-blue-600 font-medium">
                Choose a file
              </span>
              <span className="text-gray-500 text-sm mt-1">
                or drag and drop
              </span>
              <span className="text-gray-400 text-xs mt-2">
                PDF, TXT, or MD files
              </span>
            </label>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg"
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
          {documents && documents.total_documents > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {documents ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Documents:</span>
              <span className="font-semibold text-gray-800">{documents.total_documents}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Chunks:</span>
              <span className="font-semibold text-gray-800">{documents.total_chunks}</span>
            </div>

            {documents.documents && documents.documents.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Documents:</h3>
                <ul className="space-y-2">
                  {documents.documents.map((doc, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                    >
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Loading documents...</p>
        )}
      </div>
    </div>
  )
}

export default Upload
