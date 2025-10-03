
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { useChat } from '@/context/chat-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ChatNotificationIcon = () => {
  const { conversations, totalUnreadCount, isAuthenticated } = useChat();

  if (!isAuthenticated) {
    return null;
  }

  const handleConversationClick = (userId: number, userName: string) => {
    // Trigger opening the main chat sidebar with this specific conversation
    window.dispatchEvent(new CustomEvent('openChatSidebar', { 
      detail: { userId, userName } 
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {totalUnreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {conversations.length === 0 ? (
          <DropdownMenuItem disabled>
            <div className="text-center py-4 text-muted-foreground">
              No conversations yet
            </div>
          </DropdownMenuItem>
        ) : (
          conversations.slice(0, 5).map((conversation) => (
            <DropdownMenuItem
              key={conversation.userId}
              className="flex items-center gap-3 p-3 cursor-pointer"
              onClick={() => handleConversationClick(conversation.userId, conversation.userName)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{conversation.userName}</span>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        {conversations.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              <span className="text-sm text-muted-foreground">
                View all conversations
              </span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatNotificationIcon;
