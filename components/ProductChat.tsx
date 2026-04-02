"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, MessageCircle } from "lucide-react";

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

interface ChatData {
  id: string;
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
}

interface ProductChatProps {
  productId: string;
  productTitle: string;
  sellerId: string;
  sellerName: string;
  currentUserId: string;
  currentUserName: string;
}

export default function ProductChat({
  productId,
  productTitle,
  sellerId,
  sellerName,
  currentUserId,
  currentUserName,
}: ProductChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize or get existing chat
  useEffect(() => {
    if (isOpen && !chatId) {
      initializeChat();
    }
  }, [isOpen]);

  // Poll for new messages every 5 seconds when chat is open
  useEffect(() => {
    if (!isOpen || !chatId) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        setChatId(data.data.id);
        fetchMessages(data.data.id);
      } else {
        setError(data.error || "Failed to start chat");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id?: string) => {
    const targetChatId = id || chatId;
    if (!targetChatId) return;

    try {
      const response = await fetch(`/api/chat/${targetChatId}/messages`);
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
    if (!newMessage.trim() || !chatId) return;

    try {
      const response = await fetch(`/api/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const isCurrentUser = (senderId: string) => senderId === currentUserId;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          data-chat-toggle
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-[#F17105] hover:bg-[#d96504] shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#F17105] text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Chat about {productTitle}</h3>
              <p className="text-xs opacity-90">
                with {currentUserId === sellerId ? "Customer" : sellerName}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="h-64 p-4" ref={scrollRef}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F17105]"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Start a conversation!</p>
                <p className="text-xs mt-1">
                  Ask about the product, pricing, or availability.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      isCurrentUser(message.senderId)
                        ? "justify-end"
                        : "justify-start"
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
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-50 text-red-600 text-xs">
              {error}
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm"
                disabled={loading || !chatId}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-[#F17105] hover:bg-[#d96504]"
                disabled={loading || !newMessage.trim() || !chatId}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
