"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, ArrowLeft, Clock } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  isRead: boolean;
}

interface Chat {
  id: string;
  productId: string;
  customerId: string;
  sellerId: string;
  product: {
    id: string;
    title: string;
    mainImage: string | null;
    price: number | null;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
  messages: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    isRead: boolean;
  }[];
  unreadCount: number;
  updatedAt: string;
  isActive: boolean;
}

interface SellerChatInboxProps {
  userId: string;
  userName: string;
}

export default function SellerChatInbox({ userId, userName }: SellerChatInboxProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chats on mount and poll every 10 seconds
  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      const interval = setInterval(() => fetchMessages(selectedChat.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();

      if (data.success) {
        setChats(data.data);
      } else {
        setError(data.error || "Failed to fetch chats");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}/messages`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    try {
      const response = await fetch(`/api/chat/${selectedChat.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");
        // Refresh chats to update last message
        fetchChats();
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const isCurrentUser = (senderId: string) => senderId === userId;

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  // Chat List View
  if (!selectedChat) {
    return (
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="w-5 h-5 text-[#F17105]" />
            Messages
            {totalUnread > 0 && (
              <Badge className="bg-red-500 text-white">{totalUnread}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F17105] mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 text-sm">{error}</div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No messages yet</p>
              <p className="text-xs mt-1">
                When customers message you about your products, they'll appear here.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {chats.map((chat) => {
                  const lastMessage = chat.messages[0];
                  return (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        chat.unreadCount > 0 ? "bg-orange-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[#F17105] text-white text-sm">
                            {chat.customer.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">
                              {chat.customer.name}
                            </h4>
                            {lastMessage && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(lastMessage.createdAt)}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            Re: {chat.product.title}
                          </p>

                          {lastMessage && (
                            <p
                              className={`text-sm truncate mt-1 ${
                                chat.unreadCount > 0
                                  ? "font-medium text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {lastMessage.content}
                            </p>
                          )}

                          {chat.unreadCount > 0 && (
                            <Badge className="mt-2 bg-[#F17105] text-white text-xs">
                              {chat.unreadCount} new
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  }

  // Conversation View
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedChat(null)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {selectedChat.customer.name}
            </CardTitle>
            <p className="text-xs text-gray-500 truncate">
              Re: {selectedChat.product.title}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Messages */}
        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    isCurrentUser(message.senderId) ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      isCurrentUser(message.senderId)
                        ? "bg-[#F17105] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        isCurrentUser(message.senderId)
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-600 text-xs">{error}</div>
        )}

        {/* Input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 text-sm"
              disabled={sending}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-[#F17105] hover:bg-[#d96504]"
              disabled={sending || !newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
