
import { useChatBox } from "@/hooks/use-chat-box";
import ChatHeader from "./chat-header";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";

interface ChatBoxProps {
  receiverId: number;
  receiverName: string;
  onClose: () => void;
  isMinimized?: boolean;
}

const ChatBox = ({ receiverId, receiverName, onClose, isMinimized = false }: ChatBoxProps) => {
  const {
    messagesData,
    isLoading,
    isAuthenticated,
    currentUserId,
    getDisplayName,
    handleSendMessage,
    isSending,
  } = useChatBox(receiverId, receiverName);

  return (
    <div className="h-full flex flex-col">
      <ChatHeader
        receiverName={receiverName}
        displayName={getDisplayName()}
        onClose={onClose}
        showBackButton={false}
      />
      
      <ChatMessages
        messages={messagesData?.data || []}
        currentUserId={currentUserId}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        isAuthenticated={isAuthenticated}
        isSending={isSending}
        receiverDisplayName={getDisplayName()}
      />
    </div>
  );
};

export default ChatBox;
