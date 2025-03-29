/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
"use client";

import React, { useState, useEffect, useRef } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": any; // Chấp nhận mọi thuộc tính
    }
  }
}

export default function AIChatBox() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const scriptUrl = "https://elevenlabs.io/convai-widget/index.js";
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="fixed bottom-20 right-5 z-50 font-sans">
      {/* Nút mở chat */}
      <button
        className="w-14 h-14 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Cửa sổ chat */}
      <div
        className={`absolute bottom-16 right-0 w-80 h-96 md:w-96 md:h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        ref={chatContainerRef}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <h3 className="text-base font-medium">AI Assistant</h3>
          <button
            className="text-white text-lg cursor-pointer hover:text-gray-200"
            onClick={() => setIsOpen(false)}
            aria-label="Close Chat"
          >
            ✕
          </button>
        </div>

        {/* Nội dung chat */}
        <div className="flex-1 flex flex-col">
          {isLoaded ? (
            React.createElement("elevenlabs-convai", {
              "agent-id": "2ShoP2Xxk9prErlKYcYv",
              className: "h-full w-full",
            })
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500">
              Đang tải AI...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
