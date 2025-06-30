import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { MessageCircle, X, ChevronDown, Send, Paperclip, Smile, Sprout } from "lucide-react";

type Message = {
  role: "user" | "bot";
  text: string;
  image?: string;
  isThinking?: boolean;
};

const API_KEY = "AIzaSyDhG0tpqpDDIze0Id_T-YgKwR9JZCcSjKs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Placeholder for localized farming data (will be parsed from PDF)
const localizedFarmingData = `
[LOCALIZED FARMING DATA PLACEHOLDER]
This section will contain region-specific farming information parsed from PDF documents including:
- Local crop varieties and planting seasons
- Regional soil conditions and recommendations
- Climate-specific farming practices
- Local pest and disease management
- Regional market prices and trends
- Government agricultural policies and subsidies
- Local farming regulations and certifications
`;

const initialBotMessage = `Hey there!  
I am Farm Assist. Your virtual farm extension officer. What will you like to know about farming today? Just ask and tell me where you are chatting me from to get accurate localized response.`;

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: initialBotMessage },
  ]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([
    { role: "model", parts: [{ text: `Farm Assist. ${localizedFarmingData}` }] }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateBotResponse = async (userMessage: string, fileData?: { data: string; mime_type: string }) => {
    const newChatHistory: any[] = [...chatHistory, {
      role: "user",
      parts: [
        { text: `Using the localized farming data and details provided above, please address this farming query with region-specific advice: ${userMessage}` },
        ...(fileData ? [{ inline_data: fileData }] : [])
      ]
    }];

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: newChatHistory })
    };

    try {
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error?.message || 'API Error');
      
      const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/\*\*(.*?)\*\*/g, "$1")
        ?.trim() || 'No response received';
      
      setChatHistory([...newChatHistory, {
        role: "model",
        parts: [{ text: apiResponseText }]
      }]);
      
      return apiResponseText;
    } catch (error) {
      console.error(error);
      return `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`;
    }
  };

  const sendMessage = async (msg: string, img?: string) => {
    if (!msg.trim() && !file) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", text: msg, image: img }]);
    
    // Add thinking indicator
    setMessages(prev => [...prev, { role: "bot", text: "", isThinking: true }]);
    
    let fileData;
    if (file) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });
      
      fileData = {
        data: base64,
        mime_type: file.type
      };
    }
    
    const botResponse = await generateBotResponse(msg, fileData);
    
    // Remove thinking indicator and add bot response
    setMessages(prev => {
      const newMessages = prev.filter(m => !m.isThinking);
      return [...newMessages, { role: "bot", text: botResponse }];
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    
    let imgBase64: string | undefined;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        imgBase64 = ev.target?.result as string;
        await sendMessage(input, imgBase64);
        setInput("");
        setFile(null);
      };
      reader.readAsDataURL(file);
    } else {
      await sendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      {/* Toggler Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle Chatbot"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.2, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-8 w-[380px] max-w-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Farm Assist</h3>
                  <p className="text-green-100 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <button
                className="text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Minimize"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50 to-white max-h-96">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}>
                    {msg.role === "bot" && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sprout className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-green-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                      }`}
                    >
                      {msg.isThinking ? (
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'} as React.CSSProperties}></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'} as React.CSSProperties}></div>
                          </div>
                          <span className="text-gray-500 text-xs ml-2">Thinking...</span>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="attachment"
                              className="rounded-lg mt-2 max-w-[200px] border"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-100 p-4">
              {file && (
                <div className="mb-3 flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <Paperclip className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 flex-1">{file.name}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:bg-red-100 rounded-full p-1"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <form className="flex items-end gap-2" onSubmit={handleSend}>
                <div className="flex-1 relative">
                  <textarea
                    className="w-full resize-none border border-gray-200 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full p-1.5 transition-colors"
                      onClick={() => setShowEmoji((v) => !v)}
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full p-1.5 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() && !file}
                  className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
              {/* Emoji Picker */}
              {showEmoji && (
                <div className="absolute bottom-20 right-4 z-50 shadow-2xl rounded-lg overflow-hidden">
                  <Picker
                    data={data}
                    theme="light"
                    onEmojiSelect={(emoji: any) => {
                      setInput((prev) => prev + emoji.native);
                      setShowEmoji(false);
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};