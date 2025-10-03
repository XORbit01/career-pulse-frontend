
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isAuthenticated: boolean;
  isSending: boolean;
  receiverDisplayName: string;
}

const ChatInput = ({ onSendMessage, isAuthenticated, isSending, receiverDisplayName }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isAuthenticated ? `Message ${receiverDisplayName}...` : "Please log in to chat"}
          disabled={isSending || !isAuthenticated}
          className="flex-1 text-sm"
        />
        <Button
          type="submit"
          disabled={!message.trim() || isSending || !isAuthenticated}
          size="sm"
          className="px-3 bg-jobify-blue hover:bg-jobify-blue/90"
        >
          <Send size={16} />
        </Button>
      </form>
      {!isAuthenticated && (
        <p className="text-xs text-muted-foreground mt-1">
          You need to be logged in to send messages
        </p>
      )}
    </div>
  );
};

export default ChatInput;
