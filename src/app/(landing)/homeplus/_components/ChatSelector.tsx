// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-namespace */
// "use client";

// import { useState, useEffect, useRef } from "react";

// // Khai báo thẻ custom cho TypeScript
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "elevenlabs-convai": React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLElement> & { "agent-id": string; className?: string },
//         HTMLElement
//       >;
//     }
//   }
// }

// export default function ChatSelector() {
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeChat, setActiveChat] = useState<'none' | 'ai' | 'demo'>('none');
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);

//   useEffect(() => {
//     // Load ElevenLabs script if AI chat is active
//     if (activeChat === 'ai' && !isScriptLoaded) {
//       const scriptUrl = "https://elevenlabs.io/convai-widget/index.js";
//       const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

//       if (!existingScript) {
//         const script = document.createElement("script");
//         script.src = scriptUrl;
//         script.async = true;
//         script.onload = () => setIsScriptLoaded(true);
//         document.body.appendChild(script);
//       } else {
//         setIsScriptLoaded(true);
//       }
//     }
//   }, [activeChat, isScriptLoaded]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     if (activeChat !== 'none') {
//       setActiveChat('none');
//     }
//   };

//   const openChat = (chatType: 'ai' | 'demo') => {
//     setActiveChat(chatType);
//     setIsMenuOpen(false);
//   };

//   return (
//     <div className="fixed bottom-5 right-5 z-50 font-sans" id="chat-box">
//       {/* Main Chat Button */}
//       <button
//         className="w-14 h-14 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105"
//         onClick={toggleMenu}
//         aria-label="Chat Options"
//       >
//         {isMenuOpen || activeChat !== 'none' ? "✕" : "💬"}
//       </button>

//       {/* Chat Selection Menu */}
//       {isMenuOpen && (
//         <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-2 flex flex-col">
//             <button 
//               className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-colors text-left rounded-md"
//               onClick={() => openChat('ai')}
//             >
//               <span className="text-lg">🤖</span>
//               <div>
//                 <p className="font-medium">ElevenLabs AI</p>
//                 <p className="text-sm text-gray-500">Voice-enabled AI assistant</p>
//               </div>
//             </button>
            
//             <button 
//               className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-colors text-left rounded-md"
//               onClick={() => openChat('demo')}
//             >
//               <span className="text-lg">💬</span>
//               <div>
//                 <p className="font-medium">Demo Chat</p>
//                 <p className="text-sm text-gray-500">Standard chat interface</p>
//               </div>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ElevenLabs AI Chat Window */}
//       {activeChat === 'ai' && (
//         <div
//           className="absolute bottom-16 right-0 w-80 h-96 md:w-96 md:h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
//           ref={chatContainerRef}
//         >
//           {/* Header */}
//           <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
//             <h3 className="text-base font-medium">ElevenLabs AI Assistant</h3>
//             <button
//               className="text-white text-lg cursor-pointer hover:text-gray-200"
//               onClick={() => setActiveChat('none')}
//               aria-label="Close Chat"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Nội dung chat */}
//           <div className="flex-1 flex flex-col">
//             {isScriptLoaded ? (
//               <elevenlabs-convai agent-id="2ShoP2Xxk9prErlKYcYv" className="h-full w-full"></elevenlabs-convai>
//             ) : (
//               <div className="flex items-center justify-center flex-1 text-gray-500">
//                 Đang tải AI...
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Demo Chat Window (Placeholder) */}
//       {activeChat === 'demo' && (
//         <div className="absolute bottom-16 right-0 w-80 h-96 md:w-96 md:h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
//           <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
//             <h3 className="text-base font-medium">Demo Chat</h3>
//             <button
//               className="text-white text-lg cursor-pointer hover:text-gray-200"
//               onClick={() => setActiveChat('none')}
//               aria-label="Close Chat"
//             >
//               ✕
//             </button>
//           </div>
//           <div className="flex-1 p-4">
//             {/* The actual demo chat content will be rendered by ChatMessageListDemo component */}
//             <div className="text-center text-gray-500 mt-20">Demo Chat Interface</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }