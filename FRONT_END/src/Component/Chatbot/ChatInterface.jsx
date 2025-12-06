import React, { useEffect, useState } from 'react'
import MessageList from './MessageList'
import InputMessage from './InputMessage'
import TypingIndicator from './TypingIndicator'
import api from '../../api'
import { MdTransitEnterexit } from "react-icons/md";

const ChatInterface = ({setShowChatbot}) => {
    const [messages,setMessages] = useState([]);
    const [isTyping , setIsTyping] = useState(false);
    

    const message ={
        id:1, 
        isUser:false, 
        content:"Hello How Can I Help you Today ?", 
        timestamp: new Date
    };
    useEffect(() =>{
        setMessages([message])
    },[])
    


    async function SubmitToAgent(message){
        if(!message.trim()) return

        const user_message = {
                id : new Date +1,
                isUser : true,
                content : message,
                timestamp : new Date
            };
        setMessages(pre => [...pre,user_message]);


        try{
            setIsTyping(true);
            const response = await api.post("chat_view/",{"message":message});
            //console.log(response.data.response);
            const ai_response = {
                id : new Date +1,
                isUser : false,
                content : response.data.response,
                timestamp : new Date
            };
            setMessages(pre => [...pre,ai_response]);

        }
        catch(e){
            console.log(e.message);
            const ai_response = {
                id : new Date +1,
                isUser : false,
                content : `Error ${e.response?.data?.error || e.message || "Failed to Connect"} `,
                timestamp : new Date
            };
            setMessages(pre => [...pre,ai_response]);
        }
        finally{
            setIsTyping(false)
        }

    }
    

    return (
        <div className='flex justify-center items-center min-h-screen w-full bg-gray-50 p-10'>
            <div className='w-full md:w-1/2 h-screen flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden'>
                {/* Header */}
                <div className='text-white bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-t-2xl shadow-lg border-t-4 border-cyan-300'>
                    <div className='text-2xl font-extrabold mb-1 flex justify-between items-center gap-2'>
                        <div className='flex'>
                        <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
                        <div> Online Assistant</div>
                        </div>
                        <div>
                            <MdTransitEnterexit className='w-8 h-8 cursor-pointer hover:text-gray-300'
                            onClick={() => setShowChatbot(false)}
                            />
                        </div>
                    </div>

                    <div className='flex items-center text-sm font-medium'>
                        Powered by
                        <div className='bg-black/30 text-white px-4 py-1 rounded-full ml-2 font-black animation animate-pulse border border-cyan-400/50'>
                            FITNESS FLOW
                        </div>
                    </div>
                </div>

                {/* Messages Area - Fixed overflow */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    <MessageList messages={messages} />
                    {isTyping && <TypingIndicator />}
                    <div /> {/* Invisible element for auto-scroll */}
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className='flex-shrink-0 border-t border-gray-200'>
                    <InputMessage SubmitToAgent={SubmitToAgent} />
                </div>
            </div>
        </div>
    )
}

export default ChatInterface