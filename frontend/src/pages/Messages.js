import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Messages = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
    '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑',
    '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
    '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵',
    '🥶', '😶‍🌫️', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️',
    '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱',
    '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '👍', '👎',
    '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🤚',
    '✋', '🖐️', '👌', '🤏', '✊', '👊', '🤛', '🤜', '💪', '❤️', '🧡', '💛', '💚',
    '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
    '💝', '🔥', '✨', '💫', '⭐', '🌟', '💯', '✅', '🎉', '🎊', '🎈', '🎁', '🏆'
  ];

  useEffect(() => {
    fetchConversations();
    fetchUsers();

    const socket = io('http://localhost:5002');
    
    if (user) {
      socket.emit('userOnline', user._id);
      API.put('/users/status', { isOnline: true });
    }

    socket.on('newMessage', (message) => {
      if (message.sender._id === selectedUser?._id || message.receiver._id === selectedUser?._id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('userStatusChanged', ({ userId, isOnline }) => {
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isOnline } : u
      ));
      if (selectedUser?._id === userId) {
        setSelectedUser(prev => ({ ...prev, isOnline }));
      }
    });

    return () => {
      if (user) {
        API.put('/users/status', { isOnline: false });
      }
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      const user = users.find(u => u._id === userId);
      if (user) {
        handleSelectUser(user);
      }
    }
  }, [userId, users]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users/all');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleSelectUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    try {
      const { data } = await API.get(`/messages/${selectedUser._id}`);
      setMessages(data);
      await API.put(`/messages/${selectedUser._id}/read`);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imagePreview) || !selectedUser) return;

    try {
      const messageData = {
        receiverId: selectedUser._id,
        content: newMessage,
        messageType: imagePreview ? 'image' : 'text'
      };

      if (imagePreview) {
        messageData.image = imagePreview;
      }

      const { data } = await API.post('/messages', messageData);
      setMessages([...messages, data]);
      setNewMessage('');
      setImagePreview(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return 'Never';
    const diff = Date.now() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
      <div className="container mx-auto px-4 h-full">
        <div className="bg-white rounded-2xl shadow-2xl h-[calc(100vh-120px)] flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
              <input
                type="text"
                placeholder="🔍 Search users..."
                className="w-full px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {searchQuery ? (
                // Show all users when searching
                filteredUsers.map(u => (
                  <div
                    key={u._id}
                    onClick={() => handleSelectUser(u)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition ${
                      selectedUser?._id === u._id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.username} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                            {u.username[0].toUpperCase()}
                          </div>
                        )}
                        {u.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{u.username}</h3>
                        <p className="text-xs text-gray-500">
                          {u.isOnline ? '🟢 Online' : `Last seen: ${getLastSeenText(u.lastSeen)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Show only conversations when not searching
                conversations.length > 0 ? (
                  conversations.map(conv => {
                    const otherUser = conv.participants?.find(p => p._id !== user._id);
                    if (!otherUser) return null;
                    return (
                      <div
                        key={otherUser._id}
                        onClick={() => handleSelectUser(otherUser)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition ${
                          selectedUser?._id === otherUser._id ? 'bg-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {otherUser.avatar ? (
                              <img src={otherUser.avatar} alt={otherUser.username} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                                {otherUser.username[0].toUpperCase()}
                              </div>
                            )}
                            {otherUser.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{otherUser.username}</h3>
                            <p className="text-xs text-gray-500 truncate">
                              {conv.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="mb-2">💬 No conversations yet</p>
                    <p className="text-sm">Search for users to start chatting</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-lg">
                        {selectedUser.username[0].toUpperCase()}
                      </div>
                      {selectedUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{selectedUser.username}</h3>
                      <p className="text-blue-100 text-sm">
                        {selectedUser.isOnline ? '🟢 Online' : `Last seen: ${getLastSeenText(selectedUser.lastSeen)}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-2xl shadow-md ${
                          msg.sender._id === user._id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        {msg.messageType === 'image' ? (
                          <div className="p-2">
                            <img src={msg.image} alt="Sent image" className="rounded-lg max-w-full" />
                            {msg.content && <p className="mt-2 px-2">{msg.content}</p>}
                          </div>
                        ) : (
                          <div className="px-4 py-3">
                            <p className="break-words">{msg.content}</p>
                          </div>
                        )}
                        <p className={`text-xs px-4 pb-2 ${
                          msg.sender._id === user._id ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-white">
                  {imagePreview && (
                    <div className="mb-3 relative inline-block">
                      <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-24 left-6 bg-white rounded-2xl shadow-2xl p-4 w-80 max-h-64 overflow-y-auto border">
                      <div className="grid grid-cols-8 gap-2">
                        {emojis.map((emoji, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setNewMessage(newMessage + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-2xl hover:bg-gray-100 rounded p-1 transition"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="px-4 py-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition text-xl"
                    >
                      😊
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
                    >
                      📎
                    </button>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition font-semibold"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a user from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;