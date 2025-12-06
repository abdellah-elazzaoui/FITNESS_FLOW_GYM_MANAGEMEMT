import React, { useState } from 'react'

const InputMessage = ({ SubmitToAgent}) => {
    const [user_message, setUserMessage] = useState("");
    
    function handleSubmit(e) {
        e.preventDefault();
        if (user_message.trim()) {
            SubmitToAgent(user_message);
            setUserMessage("");
            
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex gap-2 p-4'>
                <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="flex-1 p-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
                    value={user_message}
                    onChange={(e) => setUserMessage(e.target.value)}
                />
                <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                    disabled={!user_message.trim()}
                >
                    Send
                </button>
            </div>
        </form>
    )
}

export default InputMessage