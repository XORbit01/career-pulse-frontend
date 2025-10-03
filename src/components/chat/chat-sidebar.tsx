
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Send, MessageCircle, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChatService from "@/services/chat-service";
import AuthService from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useChat } from "@/context/chat-context";
import ChatBox from "./chat-box";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversation?: {userId: number, userName: string} | null;
}

const ChatSidebar = ({ isOpen, onClose, initialConversation }: ChatSidebarProps) => {
  const [selectedConversation, setSelectedConversation] = useState<{userId: number, userName: string} | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { conversations, openChats } = useChat();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAuthenticated = AuthService.isAuthenticated();

  // Handle visibility state for smooth animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow exit animation to complete
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle initial conversation selection
  useEffect(() => {
    if (initialConversation && isOpen) {
      setSelectedConversation(initialConversation);
    }
  }, [initialConversation, isOpen]);

  const handleConversationSelect = (userId: number, userName: string) => {
    setSelectedConversation({ userId, userName });
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar - positioned in middle portion of screen with slide animation */}
      <div className={`fixed top-1/2 right-4 transform -translate-y-1/2 h-3/5 w-80 z-40 transition-all duration-300 ease-out ${
        isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}>
        <div className="h-full bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/30 bg-gradient-to-r from-background/80 to-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedConversation && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBackToList}
                    className="h-6 w-6 p-0 mr-2 hover:bg-accent/50 transition-colors duration-200"
                  >
                    <ChevronRight size={12} className="rotate-180" />
                  </Button>
                )}
                <MessageCircle size={16} className="text-jobify-blue" />
                <h3 className="text-sm font-medium">
                  {selectedConversation 
                    ? selectedConversation.userName
                    : 'Messages'
                  }
                </h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-accent/50 transition-colors duration-200"
              >
                <X size={12} />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 h-[calc(100%-60px)]">
            {!isAuthenticated ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-4">
                  <p className="text-muted-foreground text-sm">Please log in to view messages</p>
                </div>
              </div>
            ) : selectedConversation ? (
              <div className="h-full">
                <ChatBox
                  receiverId={selectedConversation.userId}
                  receiverName={selectedConversation.userName}
                  onClose={handleBackToList}
                  isMinimized={false}
                />
              </div>
            ) : (
              <ScrollArea className="h-full p-4">
                {conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm">No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conversation, index) => (
                      <div
                        key={conversation.userId}
                        className={`p-3 rounded-xl border border-border/30 hover:bg-accent/30 cursor-pointer transition-all duration-200 hover:shadow-md backdrop-blur-sm transform hover:scale-[1.02] animate-fade-in`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => handleConversationSelect(conversation.userId, conversation.userName)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{conversation.userName}</h4>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <div className="mt-1">
                            <p className="text-xs text-muted-foreground truncate">
                              {conversation.lastMessage.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
