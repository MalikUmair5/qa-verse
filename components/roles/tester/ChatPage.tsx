'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import Loader from '@/components/ui/loader'
import { FiSend, FiSearch } from 'react-icons/fi'
import type { ChatMessage } from '@/lib/types'

interface Conversation {
  userId: string
  userName: string
  userRole: string
  lastMessage: string
  lastMessageDate: string
  unreadCount: number
}

function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages()
    }
  }, [selectedUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const response = await api.chat.getConversations(user?.id || '')
      if (response.success && response.data) {
        const convData = Array.isArray(response.data) ? response.data : []
        setConversations(convData as Conversation[])
        if (convData.length > 0) {
          setSelectedUserId(convData[0].userId)
        }
      } else {
        setConversations([])
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.chat.getMessages({ userId: user?.id || '' })
      if (response.success && response.data) {
        const allMessages = response.data as ChatMessage[]
        // Filter messages for selected conversation
        const conversationMessages = allMessages.filter(
          msg => (msg.senderId === selectedUserId || msg.receiverId === selectedUserId)
        )
        setMessages(conversationMessages)
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUserId) return

    try {
      const response = await api.chat.sendMessage({
        senderId: user?.id || '',
        senderName: user?.name || '',
        senderRole: user?.role || 'tester',
        receiverId: selectedUserId,
        message: newMessage.trim()
      })

      if (response.success) {
        await fetchMessages()
        setNewMessage('')
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter(conv =>
    conv?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConversation = conversations.find(c => c.userId === selectedUserId)

  if (isLoading) return <Loader />

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">Messages</h1>
          <p className="text-sm sm:text-base text-[#666]">Communicate with team members</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-12 md:col-span-4 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUserId === conv.userId ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#A33C13] to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {conv.userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-[#171717] truncate">{conv.userName}</h3>
                            <span className="text-xs text-gray-500">{formatTimestamp(conv.lastMessageDate)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                            {conv.unreadCount > 0 && (
                              <span className="ml-2 bg-[#A33C13] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 capitalize">{conv.userRole}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="col-span-12 md:col-span-8 flex flex-col">
              {selectedUserId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#A33C13] to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedConversation?.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#171717]">{selectedConversation?.userName}</h3>
                        <span className="text-sm text-gray-600 capitalize">{selectedConversation?.userRole}</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isSentByMe = message.senderId === user?.id
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isSentByMe ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-lg p-3 ${
                                  isSentByMe
                                    ? 'bg-gradient-to-r from-[#A33C13] to-orange-500 text-white'
                                    : 'bg-gray-200 text-[#171717]'
                                }`}
                              >
                                <p className="break-words">{message.message}</p>
                              </div>
                              <span className={`text-xs text-gray-500 mt-1 block ${isSentByMe ? 'text-right' : 'text-left'}`}>
                                {formatTimestamp(message.createdDate)}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-[#A33C13] to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSend className="text-xl" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ChatPage
