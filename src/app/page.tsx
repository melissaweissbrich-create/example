'use client'

import { useState } from 'react'
import ChatMessage from '@/components/ChatMessage'
import MessageInput from '@/components/MessageInput'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/travelguide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Fehler beim Senden der Nachricht')
      }

      const assistantMessage: Message = { role: 'assistant', content: data.reply }
      setMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { 
        role: 'assistant', 
        content: `Entschuldigung, es ist ein Fehler aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` 
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            🏕️ Travel Guide
          </h1>
          <p className="text-white/90 mt-2">
            Ihr Spezialist für maßgeschneiderte Camping-Rundreisen durch Europa
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-primary/20">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Willkommen bei Ihrem persönlichen Travel Guide! 🌍
            </h2>
            <p className="text-text/80 mb-4">
              Ich helfe Ihnen dabei, die perfekte Camping-Rundreise durch Europa zu planen. 
              Zusammen erstellen wir eine maßgeschneiderte Route basierend auf Ihren Wünschen und Interessen.
            </p>
            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="font-semibold text-secondary mb-2">So funktioniert es:</h3>
              <ul className="text-sm text-text/80 space-y-1">
                <li>• Ich stelle Ihnen 6 gezielte Fragen zu Ihrer Reise</li>
                <li>• Basierend darauf erstelle ich 2-3 detaillierte Routenvorschläge</li>
                <li>• Sie erhalten konkrete Camping-/Stellplätze, Aktivitäten und Events</li>
                <li>• Alles mit direkten Links für Ihre Planung</li>
              </ul>
            </div>
            <p className="text-text/60 mt-4 text-sm">
              Schreiben Sie einfach &quot;Hallo&quot; oder &quot;Ich möchte eine Reise planen&quot;, um zu beginnen.
            </p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg shadow-md p-4 max-w-xs border border-primary/20">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-text/60">Plane Ihre Reise...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />

        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={clearChat}
              className="text-sm text-text/60 hover:text-secondary transition-colors"
            >
              Chat löschen
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/80">
            Travel Guide - Ihr persönlicher Assistent für Europa-Rundreisen
          </p>
        </div>
      </footer>
    </div>
  )
}