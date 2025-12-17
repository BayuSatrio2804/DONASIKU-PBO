'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Message {
  id: number;
  sender: 'user' | 'other';
  text: string;
  time: string;
}

export default function ChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatName = params.id as string;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'other',
      text: 'Halo, apa kabar? 👋',
      time: '11:31 AM',
    },
    {
      id: 2,
      sender: 'user',
      text: 'apakah barangnya ada?',
      time: '11:33 AM',
    },
    {
      id: 3,
      sender: 'other',
      text: 'tentu ada',
      time: '11:35 AM',
    },
    {
      id: 4,
      sender: 'other',
      text: 'saya cek ulang ya',
      time: '11:36 AM',
    },
    {
      id: 5,
      sender: 'user',
      text: 'baik, terima kasih 🙏',
      time: '11:37 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        text: inputText,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setIsTyping(true);

      // Simulate other user typing and responding
      setTimeout(() => {
        const responses = [
          'Iya, sudah siap!',
          'Baik, kapan bisa diambil?',
          'Berapa total harganya?',
          'Okay, oke deh 👍',
          'Siapa pemilik barangnya?',
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        const replyMessage: Message = {
          id: messages.length + 2,
          sender: 'other',
          text: randomResponse,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, replyMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header - Sticky */}
      <div className="sticky top-0 bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 z-10">
        <button
          onClick={() => router.back()}
          className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          &lt;
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-lg">
            {chatName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-lg font-semibold text-gray-900 capitalize">
            {chatName}
          </h1>
        </div>
      </div>

      {/* Messages - Only scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-linear-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-fade-in`}
          >
            <div
              className={`flex gap-2 max-w-xs ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.sender === 'other' && (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-orange-500 shrink-0 flex items-center justify-center text-white font-bold text-xs">
                  {chatName.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-900 shadow-xs'
                }`}
              >
                <p className="text-sm break-all">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-600'
                  }`}
                >
                  {message.time}{' '}
                  {message.sender === 'user' && '✓'}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-orange-500 shrink-0 flex items-center justify-center text-white font-bold text-xs">
                {chatName.charAt(0).toUpperCase()}
              </div>
              <div className="bg-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Sticky */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 z-10">
        <div className="flex items-end gap-3">
          <button className="text-gray-600 hover:text-gray-900 text-xl hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0">
            😊
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tulis pesan anda..."
            className="flex-1 bg-gray-100 rounded-full py-3 px-4 outline-none focus:bg-white focus:border focus:border-gray-300 placeholder-gray-500 text-gray-900 text-sm"
          />
          <button className="text-gray-600 hover:text-gray-900 text-xl hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0">
            ➕
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed text-xl hover:bg-blue-50 p-2 rounded-full transition-colors shrink-0"
          >
            ✈️
          </button>
        </div>
      </div>
    </div>
  );
}
