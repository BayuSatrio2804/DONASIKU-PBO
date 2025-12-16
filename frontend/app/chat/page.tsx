'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  sender: 'user' | 'other';
  text: string;
  time: string;
}

interface ChatItem {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  messages?: Message[];
}

const chatData: ChatItem[] = [
  {
    id: 1,
    name: 'Kak Dias',
    lastMessage: 'Halo Devhope · 9:40 AM',
    time: '9:40 AM',
    avatar: '👨‍💼',
    messages: [
      {
        id: 1,
        sender: 'other',
        text: 'Halo, apa kabar?',
        time: '9:35 AM',
      },
      {
        id: 2,
        sender: 'user',
        text: 'Baik, kamu gimana?',
        time: '9:38 AM',
      },
      {
        id: 3,
        sender: 'other',
        text: 'Halo Devhope',
        time: '9:40 AM',
      },
    ],
  },
  {
    id: 2,
    name: 'Edsel',
    lastMessage: 'You: Ok, Halo semua · 9:25 AM',
    time: '9:25 AM',
    avatar: '👨‍🦰',
    messages: [
      {
        id: 1,
        sender: 'other',
        text: 'Halo semua',
        time: '9:20 AM',
      },
      {
        id: 2,
        sender: 'user',
        text: 'Ok, Halo semua',
        time: '9:25 AM',
      },
    ],
  },
  {
    id: 3,
    name: 'Nabil',
    lastMessage: 'You: Salam kenal ya... · Fri',
    time: 'Fri',
    avatar: '👩‍🦱',
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'Salam kenal ya...',
        time: 'Fri',
      },
    ],
  },
  {
    id: 4,
    name: 'Firdha',
    lastMessage: 'Selamat berlibur! · Fri',
    time: 'Fri',
    avatar: '👩‍🦱',
    messages: [
      {
        id: 1,
        sender: 'other',
        text: 'Selamat berlibur!',
        time: 'Fri',
      },
    ],
  },
  {
    id: 5,
    name: 'Radit',
    lastMessage: 'Selamat beraktivitas... · Thu',
    time: 'Thu',
    avatar: '👨‍💼',
    messages: [
      {
        id: 1,
        sender: 'other',
        text: 'Selamat beraktivitas...',
        time: 'Thu',
      },
    ],
  },
  {
    id: 6,
    name: 'Zunadea',
    lastMessage: 'Halo semuanya · Thu',
    time: 'Thu',
    avatar: '👨‍💼',
    messages: [
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
    ],
  },
];

export default function ChatPage() {
  const router = useRouter();
  const [chats] = useState<ChatItem[]>(chatData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (chat: ChatItem) => {
    setSelectedChat(chat);
    setMessages(chat.messages || []);
    setInputText('');
  };

  const handleSendMessage = () => {
    if (inputText.trim() && selectedChat) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user' as const,
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

  const handleBackFromChat = () => {
    setSelectedChat(null);
    setMessages([]);
    setSearchQuery('');
  };

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={handleBackFromChat}
            className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            &lt;
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-lg">
              {selectedChat.avatar}
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              {selectedChat.name}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          &lt;
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 flex gap-8 px-6 py-4 sticky top-16 z-10">
        <button className="pb-3 font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Riwayat Barang
        </button>
        <button className="pb-3 font-medium text-blue-600 border-b-2 border-blue-600">
          Riwayat Chat
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 outline-none focus:bg-white focus:border focus:border-gray-300 placeholder-gray-500 text-gray-900"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="divide-y divide-gray-200 bg-white">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-xl shrink-0">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {chat.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              No chats found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
