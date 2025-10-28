
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from './types';
import { getEduvantResponse } from './services/geminiService';
import { Message } from './components/Message';
import { SendIcon } from './components/Icons';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getEduvantResponse(updatedMessages);
      const newAiMessage: ChatMessage = { role: 'model', content: aiResponse };
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">EDUVANT</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Cố vấn chiến lược khóa học online của bạn</p>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center animate-pulse"></div>
            <div className="max-w-xl rounded-xl px-4 py-3 shadow-md bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSend} className="flex items-center max-w-3xl mx-auto gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            className="flex-1 w-full px-4 py-2 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;
