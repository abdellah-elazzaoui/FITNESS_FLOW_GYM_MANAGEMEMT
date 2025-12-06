import React from 'react'

const MessageList = ({messages}) => {
    
  return (
    <div className='overflow-y-auto'>
      {messages.map((message)=>(
        <div key={message.id}  className={`w-full mt-1 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`text-lg p-2 ml-2 border-2  max-w-96 ${message.isUser ? "bg-blue-700 text-white rounded-3xl rounded-tr-none":"bg-gray-100 rounded-3xl rounded-bl-none"}`}
            >
                {message.content}
               
                <div className='flex justify-end'> 
                    {message.timestamp instanceof Date ?
                    message.timestamp.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
                    :
                    new Date(message.timestamp).toLocaleDateString([],{hour:'2-digit',minute:'2-digit'})
                    }
                
                </div>
            </div>
            
            
        </div>
      ))}
      
    </div>
  )
}

export default MessageList
