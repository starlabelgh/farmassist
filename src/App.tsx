import React, { useState } from "react";
import { Chatbot } from "./components/Chatbot";
import ChatBubbles from "./components/ChatBubbles";
import { FullMessage } from "./types";

const sampleMessages: FullMessage = {
  id: "1",
  language: "en",
  message1: "Hello! I'm having trouble with my tomato plants. The leaves are turning yellow and I'm not sure what's causing it.",
  message2: "I can help you with that! Yellow leaves on tomato plants can indicate several issues. Are you noticing the yellowing starting from the bottom leaves or throughout the plant?",
  message3: "It's starting from the bottom leaves and moving upward. Also, I've been watering them every day because it's been quite hot.",
  chatButton: {
    buttonLabel: "Chat with Farm Assist",
    buttonIcon: "🌱"
  },
  isActive: true
};

function App() {
  const [language, setLanguage] = useState("en");
  
  const handleSwitchLanguage = () => {
    setLanguage(prev => prev === "en" ? "es" : "en");
  };

  return (
    <>
      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-green-50/85 to-teal-50/90" />
        
        {/* Hero Section */}
        <div className="relative z-20 pt-10 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl mb-8 shadow-2xl overflow-hidden">
                <img 
                  src="/favicon.png" 
                  alt="Farm Assist Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                Farm Assist
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your AI-powered farming companion. Get expert advice, solve problems, and optimize your agricultural practices with intelligent assistance.
              </p>
            </div>
            
            {/* Chat Demo Section */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Floating background elements */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                
                <div className="relative backdrop-blur-sm bg-white/30 rounded-3xl p-8 shadow-2xl border border-white/20">
                  <ChatBubbles 
                    handleSwitchLanguage={handleSwitchLanguage}
                    messages={sampleMessages}
                    language={language}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Chatbot />
      </div>
    </>
  );
}

export default App;