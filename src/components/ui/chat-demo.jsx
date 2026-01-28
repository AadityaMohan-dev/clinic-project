import React, { useState } from "react";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { ChatMessageList } from "./chat-message-list"; // Ensure you create this too
import { ChatInput } from "./chat-input"; // Ensure you create this too

export function ChatMessageListDemo() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! I'm Welbi. How can I help you with your dental appointment today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), content: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: "I've noted that! Our doctors specialize in orthodontics. Do you have any specific questions about our treatments?",
        sender: "ai"
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <ChatMessageList>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 p-4`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="p-4 text-xs text-gray-400 animate-pulse">Welbi is typing...</div>}
        </ChatMessageList>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="relative flex items-center bg-white border rounded-xl px-2 shadow-sm">
          <ChatInput 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask Welbi anything..."
            className="border-none focus:ring-0"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg ml-2">
            <CornerDownLeft size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}