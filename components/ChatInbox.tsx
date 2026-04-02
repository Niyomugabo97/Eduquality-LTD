"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Clock } from "lucide-react";

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
  seller: {
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

interface ChatInboxProps {
  currentUserId: string;
  userType: "customer" | "seller";
}

export default function ChatInbox({ currentUserId, userType }: ChatInboxProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    fetchChats();

    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const getOtherParty = (chat: Chat) => {
    return chat.customerId === currentUserId ? chat.seller : chat.customer;
  };

  const getLastMessage = (chat: Chat) => {
    if (chat.messages.length === 0) return null;
    return chat.messages[0];
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

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

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F17105] mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading chats...</p>
        </CardContent>
      </Card>
    );
  }

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
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        {chats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No messages yet</p>
            <p className="text-xs mt-1">
              Start chatting with sellers about products you're interested in.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {chats.map((chat) => {
                const otherParty = getOtherParty(chat);
                const lastMessage = getLastMessage(chat);

                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      chat.unreadCount > 0 ? "bg-orange-50/50" : ""
                    } ${selectedChat?.id === chat.id ? "bg-orange-100" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#F17105] text-white text-sm">
                          {otherParty.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {otherParty.name}
                          </h4>
                          {lastMessage && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(lastMessage.createdAt)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {chat.product.title}
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
