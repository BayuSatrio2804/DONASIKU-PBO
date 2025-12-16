'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const chatName = params.id as string;
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Hi zuna 👋',
      time: '11:31 AM',
    },
    {
      id: 2,
      sender: 'user',
      text: 'apakah barangnya ada?',
      time: '11:31 AM',
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
      time: '11:31 AM',
    },
    {
      id: 5,
      sender: 'user',
      text: 'baik, terima kasih',
      time: '11:31 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
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
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          &lt;
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-lg">
            👨‍💼
          </div>
          <h1 className="text-lg font-semibold text-gray-900 capitalize">
            {chatName}
          </h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex gap-2 max-w-xs ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.sender === 'other' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0"></div>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
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
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
          <button className="text-gray-600 hover:text-gray-900 text-lg">
            😊
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Tulis pesan anda"
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
          />
          <button className="text-gray-600 hover:text-gray-900 text-lg">
            ➕
          </button>
          <button
            onClick={handleSendMessage}
            className="text-blue-500 hover:text-blue-600 text-lg"
          >
            ✈️
          </button>
        </div>
      </div>
    </div>
  );
}
