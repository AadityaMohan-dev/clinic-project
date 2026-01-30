import React, { useState, useEffect, useRef } from "react";
import { CornerDownLeft } from "lucide-react";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";

export function ChatMessageListDemo() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! I'm Welbi, your dental health assistant. How can I help you with your dental health today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Dental Triage Logic: Sequence of questions
  const getDoctorResponse = (userText) => {
    const triageSteps = [
      "I understand. To help our doctors prepare, could you describe exactly where you feel the discomfort? (e.g., top-left, bottom-right)",
      "How long has this been bothering you, and is the pain constant or does it come and go?",
      "On a scale of 1 to 10, how would you rate the pain right now?",
      "Does the area feel sensitive to hot or cold temperatures, or perhaps when you bite down?",
      "Have you noticed any swelling in your gums or around your face near the painful area?",
      "Are you currently taking any medications or have any known allergies we should be aware of?",
      // Pre-requisite check
      "Understood. For safety, do you have a history of high Blood Pressure? If possible, please have your BP checked and bring the reading with you.",
      "If you have any X-rays from the last 6 months, please bring them. If not, would you like us to schedule a quick digital scan prior to your consultation?",
      "Almost done! Are there any other symptoms like a fever or a bad taste in your mouth?",
      "Thank you for providing these details. I have prepared your clinical notes for the dentist. Would you like to finalize your appointment time now?"
    ];

    return triageSteps[step] || "Thank you. Our clinical team will review your notes immediately upon your arrival. See you soon!";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), content: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking like a doctor
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        content: getDoctorResponse(input),
        sender: "ai"
      };
      setMessages(prev => [...prev, aiMsg]);
      setStep(prev => prev + 1);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-white font-sans border rounded-2xl shadow-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b bg-blue-50">
        <h2 className="font-bold text-blue-900">Welbi Dental Triage</h2>
        <p className="text-xs text-blue-600">Initial Clinical Assessment</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar" ref={scrollRef}>
        <ChatMessageList>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 p-4`}>
              <div className={`max-w-[85%] p-4 shadow-sm ${
                m.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl' 
                : 'bg-gray-100 text-gray-800 rounded-t-2xl rounded-br-2xl border border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="p-4 flex gap-2 items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </ChatMessageList>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="relative flex items-center bg-gray-50 border rounded-2xl px-3 py-1 shadow-inner">
          <ChatInput 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Describe your symptoms..."
            className="bg-transparent border-none focus:ring-0 text-sm"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="p-2 bg-blue-600 text-white rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-300"
          >
            <CornerDownLeft size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2 italic">
          Welbi provides triage support, not a final diagnosis.
        </p>
      </form>
    </div>
  );
}