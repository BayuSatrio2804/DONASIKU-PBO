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

interface DonationItem {
  id: number;
  donorName: string;
  donorUsername: string;
  role: string;
  purpose: string;
  itemName: string;
  quantity: number;
  image: string;
  status: 'selesai' | 'dikirim' | 'dibatalkan';
}

const donationData: DonationItem[] = [
  {
    id: 1,
    donorName: 'Nama Pendonasi',
    donorUsername: 'Zunadea Kusmiandita',
    role: 'Donatur',
    purpose: 'Panil Asuhan Al - Ghifari',
    itemName: 'Tas Dewasa',
    quantity: 1,
    image: '👜',
    status: 'selesai',
  },
  {
    id: 2,
    donorName: 'Nama Pendonasi',
    donorUsername: 'Zunadea Kusmiandita',
    role: 'Donatur',
    purpose: 'Panil Asuhan Al - Ghifari',
    itemName: 'Baju Dewasa Pria',
    quantity: 1,
    image: '👕',
    status: 'dikirim',
  },
  {
    id: 3,
    donorName: 'Nama Pendonasi',
    donorUsername: 'Zunadea Kusmiandita',
    role: 'Donatur',
    purpose: 'Panil Asuhan Al - Ghifari',
    itemName: 'Baju Dewasa Pria',
    quantity: 1,
    image: '👕',
    status: 'dibatalkan',
  },
];

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
];

const statusStyles = {
  selesai: 'bg-green-100 text-green-800',
  dikirim: 'bg-yellow-100 text-yellow-800',
  dibatalkan: 'bg-red-100 text-red-800',
};

const statusLabels = {
  selesai: 'Selesai',
  dikirim: 'Dikirim',
  dibatalkan: 'Dibatalkan',
};

export default function RiwayatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('barang');
  const [donations] = useState<DonationItem[]>(donationData);
  const [chats] = useState<ChatItem[]>(chatData);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`flex gap-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
              >
                {message.sender === 'other' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0"></div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-900'
                    }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${message.sender === 'user'
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

      {/* Tabs - Styled like design */}
      <div className="bg-white py-4 px-4 flex justify-center sticky top-16 z-10">
        <div className="inline-flex bg-white rounded-full p-1 border border-gray-300 gap-2">
          <button
            onClick={() => setActiveTab('barang')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'barang'
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:text-gray-900'
              }`}
          >
            Riwayat Barang
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'chat'
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:text-gray-900'
              }`}
          >
            Riwayat Chat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeTab === 'barang' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Left Section - Donor Info */}
                  <div className="flex gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-xl shrink-0">
                      👨‍💼
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {donation.donorName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {donation.donorUsername}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Role Akun
                      </p>
                      <p className="text-sm text-gray-700">
                        {donation.role}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Tujuan Donasi
                      </p>
                      <p className="text-sm text-gray-700">
                        {donation.purpose}
                      </p>
                    </div>
                  </div>

                  {/* Right Section - Item Info & Status */}
                  <div className="flex flex-col items-end gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[donation.status]
                        }`}
                    >
                      {statusLabels[donation.status]}
                    </div>
                    <div className="text-center">
                      <p className="text-4xl mb-2">{donation.image}</p>
                      <p className="text-xs text-gray-500 mb-1">
                        Nama Barang
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {donation.itemName}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Jumlah Barang
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {donation.quantity} Pcs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-2xl mx-auto">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-full py-3 pl-12 pr-4 outline-none focus:border-blue-500 placeholder-gray-500 text-gray-900"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="divide-y divide-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
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
        )}
      </div>

      {/* Bottom Navigation */}

    </div>
  );
}
