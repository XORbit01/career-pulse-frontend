
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ChatMessage } from "@/services/chat-service";

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const ChatMessages = ({ messages, currentUserId, isLoading, isAuthenticated }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <ScrollArea className="flex-1 p-4">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Please log in to view messages</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-jobify-blue"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg text-sm ${
                  msg.sender_id === currentUserId
                    ? 'bg-jobify-blue text-white'
                    : 'bg-muted'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === currentUserId ? 'text-blue-100' : 'text-muted-foreground'
                }`}>
                  {formatMessageTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatMessages;
