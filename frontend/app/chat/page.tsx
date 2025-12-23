'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  chatMessageId: number;
  sender: {
    userId: number;
    username: string;
    role: string;
  };
  message: string;
  sentAt: string;
  isRead: boolean;
}

interface Chat {
  chatId: number;
  donatur: {
    userId: number;
    username: string;
    fotoProfil: string;
    role: string;
  };
  penerima: {
    userId: number;
    username: string;
    fotoProfil: string;
    role: string;
  };
  startedAt: string;
}

interface ChatItem {
  chatId: number;
  otherUserId: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
}

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ userId: number; username: string } | null>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize User & Load Chats
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('userSession');
      if (sessionStr) {
        const userData = JSON.parse(sessionStr);
        setCurrentUser(userData);
        fetchChatList(userData.userId);
      } else {
        router.push('/auth/login');
      }
    }
  }, []);

  // 2. Fetch Chat List from API with Error Handling
  const fetchChatList = async (userId: number, isRetry = false) => {
    try {
      if (!isRetry) setIsLoading(true);
      setError(null);

      const res = await fetch(`http://localhost:8080/api/chat/list/${userId}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP ${res.status}: Gagal mengambil daftar chat`);
      }

      const data: Chat[] = await res.json();

      // Transform API data to UI structure
      const transformedChats: ChatItem[] = data.map((chat) => {
        const isDonatur = chat.donatur.userId === userId;
        const otherUser = isDonatur ? chat.penerima : chat.donatur;

        return {
          chatId: chat.chatId,
          otherUserId: otherUser.userId,
          name: otherUser.username,
          lastMessage: 'Tap to view chat',
          time: new Date(chat.startedAt).toLocaleDateString(),
          avatar: otherUser.role === 'admin' ? '👨‍💻' : '👤',
          unread: 0
        };
      });
      setChats(transformedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError(error instanceof Error ? error.message : 'Gagal memuat daftar chat. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fetch Messages when Chat selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chatId);
      // Optional: Polling every 5 sec
      const interval = setInterval(() => fetchMessages(selectedChat.chatId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const fetchMessages = async (chatId: number) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`http://localhost:8080/api/chat/${chatId}/history`);
      if (res.ok) {
        const data: ChatMessage[] = await res.json();
        setMessages(data);
      } else {
        const errorText = await res.text();
        console.error('Failed to load messages:', errorText);
        // Don't show error for empty chat history
        if (res.status !== 404) {
          setError('Gagal memuat riwayat pesan');
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Koneksi terputus. Gagal memuat pesan.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatClick = (chat: ChatItem) => {
    setSelectedChat(chat);
    setMessages([]);
    setInputText('');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedChat || !currentUser || isSending) return;

    const messageText = inputText.trim();
    setInputText(''); // Clear immediately for better UX
    setIsSending(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('senderId', currentUser.userId.toString());
      params.append('receiverId', selectedChat.otherUserId.toString());
      params.append('message', messageText);

      const res = await fetch(`http://localhost:8080/api/chat/send?${params.toString()}`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchMessages(selectedChat.chatId); // Refresh messages
      } else {
        const errorText = await res.text();
        setInputText(messageText); // Restore message on error
        setError(errorText || 'Gagal mengirim pesan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setInputText(messageText); // Restore message on error
      setError('Koneksi terputus. Pesan tidak terkirim.');
    } finally {
      setIsSending(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackFromChat = () => {
    setSelectedChat(null);
    setMessages([]);
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
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-lg text-white">
              {selectedChat.avatar === '👤' ? selectedChat.name.charAt(0).toUpperCase() : selectedChat.avatar}
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              {selectedChat.name}
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
          {messages.map((msg) => {
            const isMe = msg.sender.userId === currentUser?.userId;
            return (
              <div
                key={msg.chatMessageId}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0 flex items-center justify-center font-bold text-gray-700">
                      {msg.sender.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'
                        }`}
                    >
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-4 py-4 bg-white">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder="Tulis pesan anda..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="text-blue-600 hover:text-blue-700 disabled:opacity-50 text-xl font-bold"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-4 flex items-center gap-4 z-20">
        <button
          onClick={() => router.back()}
          className="text-2xl text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          &lt;
        </button>
        <span className="font-bold text-lg text-black">Pesan</span>
      </div>

      {/* Tabs - Fixed */}
      <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 flex gap-8 px-6 py-4 z-20">
        <button className="pb-3 font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Riwayat Barang
        </button>
        <button className="pb-3 font-medium text-blue-600 border-b-2 border-blue-600">
          Riwayat Chat
        </button>
      </div>

      {/* Search Bar - Fixed */}
      <div className="fixed top-32 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-20">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 outline-none focus:bg-white focus:border focus:border-gray-300 placeholder-gray-500 text-gray-900"
          />
        </div>
      </div>

      {/* Chat List - Scrollable */}
      <div className="mt-48 flex-1 overflow-y-auto bg-white divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Memuat chat...</div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <button
              key={chat.chatId}
              onClick={() => handleChatClick(chat)}
              className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-4 relative"
            >
              <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-xl shrink-0 text-white font-bold">
                {chat.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {chat.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>
              <span className="text-xs text-gray-400 ml-2">{chat.time}</span>
            </button>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            Belum ada riwayat chat.
          </div>
        )}
      </div>
    </div>
  );
}
