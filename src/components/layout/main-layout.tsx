
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { useChat } from "@/context/chat-context";
import AuthService from "@/services/auth-service";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<{userId: number, userName: string} | null>(null);
  const { conversations, isAuthenticated } = useChat();

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  // Listen for external events to open chat with specific user
  useEffect(() => {
    const handleOpenChatSidebar = (event: CustomEvent) => {
      const { userId, userName } = event.detail;
      setSelectedConversation({ userId, userName });
      setIsChatOpen(true);
    };

    window.addEventListener('openChatSidebar', handleOpenChatSidebar as EventListener);
    
    return () => {
      window.removeEventListener('openChatSidebar', handleOpenChatSidebar as EventListener);
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setSelectedConversation(null); // Reset selection when opening fresh
    }
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
  };

  return (
    <div className="min-h-screen flex w-full relative">
      {/* Main content area - no longer shifting */}
      <div className="flex-1 w-full">
        {children}
        
        {/* Chat toggle button - floating with enhanced animations - only shown to authenticated users */}
        {isAuthenticated && (
          <Button
            onClick={toggleChat}
            className={`fixed bottom-6 right-6 h-12 w-12 rounded-full bg-jobify-blue hover:bg-jobify-blue/90 shadow-lg z-20 transition-all duration-300 hover:scale-110 active:scale-95 ${
              isChatOpen ? 'rotate-180' : 'rotate-0'
            }`}
            size="sm"
          >
            <MessageCircle size={20} className="transition-transform duration-200" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center animate-pulse">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Chat sidebar - overlay style */}
      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={handleChatClose}
        initialConversation={selectedConversation}
      />
    </div>
  );
};

export default MainLayout;
