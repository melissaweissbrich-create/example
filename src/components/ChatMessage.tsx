'use client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-3xl rounded-lg shadow-md p-4 
        ${isUser 
          ? 'bg-primary text-white' 
          : 'bg-white border border-primary/20'
        }
      `}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            {/* Format the assistant's response */}
            <div className="whitespace-pre-wrap text-text">
              {message.content.split('\n').map((line, index) => {
                // Handle headers
                if (line.startsWith('🎯') || line.startsWith('🛑') || line.startsWith('🔹') || line.startsWith('🔸') || line.startsWith('🔍')) {
                  return (
                    <h3 key={index} className="font-semibold text-secondary mt-4 mb-2">
                      {line}
                    </h3>
                  )
                }
                
                // Handle bullet points
                if (line.startsWith('•') || line.startsWith('-')) {
                  return (
                    <div key={index} className="ml-4 mb-1">
                      {line}
                    </div>
                  )
                }
                
                // Handle numbered items
                if (/^\d+\./.test(line.trim())) {
                  return (
                    <div key={index} className="ml-4 mb-2 font-medium">
                      {line}
                    </div>
                  )
                }
                
                // Handle empty lines
                if (line.trim() === '') {
                  return <br key={index} />
                }
                
                // Handle separator lines
                if (line.includes('___')) {
                  return <hr key={index} className="my-4 border-primary/20" />
                }
                
                // Regular text
                return (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}