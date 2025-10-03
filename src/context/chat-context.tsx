
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ChatService, { ChatMessage, ConversationData } from '@/services/chat-service';
import ProfileService from '@/services/profile-service';
import AuthService from '@/services/auth-service';

interface ChatConversation {
  conversationId: number;
  userId: number;
  userName: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatContextType {
  conversations: ChatConversation[];
  openChats: Map<number, boolean>;
  totalUnreadCount: number;
  openChat: (userId: number, userName: string) => void;
  closeChat: (userId: number) => void;
  markAsRead: (conversationId: number) => void;
  getConversationId: (userId: number) => number | undefined;
  isAuthenticated: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openChats, setOpenChats] = useState<Map<number, boolean>>(new Map());
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUserId = AuthService.getUserId();

  // Query for getting all conversations
  const { data: conversationsData } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => ChatService.getConversations(),
    enabled: isAuthenticated,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Fetch user profiles for conversations
  const fetchUserProfile = async (userId: number): Promise<string> => {
    try {
      const profile = await ProfileService.getProfileById(userId.toString());
      if (profile.profileType === 'job_seeker') {
        const firstName = profile.first_name || '';
        const lastName = profile.last_name || '';
        return `${firstName} ${lastName}`.trim() || `User ${userId}`;
      } else {
        return profile.company_name || `User ${userId}`;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return `User ${userId}`;
    }
  };

  useEffect(() => {
    if (conversationsData?.data && currentUserId) {
      // Handle the case where conversations can be null
      const conversationsArray = conversationsData.data.conversations;
      
      if (conversationsArray && Array.isArray(conversationsArray)) {
        // Transform conversation data to include user info and unread counts
        const transformConversations = async () => {
          const transformedConversations: ChatConversation[] = await Promise.all(
            conversationsArray.map(async (conv: ConversationData) => {
              const otherUserId = conv.participant_one_id === currentUserId 
                ? conv.participant_two_id 
                : conv.participant_one_id;
              
              const userName = await fetchUserProfile(otherUserId);
              
              return {
                conversationId: conv.id,
                userId: otherUserId,
                userName,
                unreadCount: 0, // We'll need to calculate this from messages
              };
            })
          );
          
          setConversations(transformedConversations);
        };
        
        transformConversations();
      } else {
        // Handle the case where conversations is null (no conversations)
        console.log('No conversations found - conversations is null');
        setConversations([]);
      }
    } else {
      // Handle cases where data is not available
      console.log('No conversations data or user not authenticated');
      setConversations([]);
    }
  }, [conversationsData, currentUserId]);

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const openChat = async (userId: number, userName?: string) => {
    setOpenChats(prev => new Map(prev).set(userId, true));
    
    // Add conversation to list if it doesn't exist
    setConversations(prev => {
      const exists = prev.find(conv => conv.userId === userId);
      if (!exists) {
        // If userName is not provided, fetch it
        const addConversation = async () => {
          const displayName = userName || await fetchUserProfile(userId);
          setConversations(prevConv => [...prevConv, {
            conversationId: 0, // Will be created when first message is sent
            userId,
            userName: displayName,
            unreadCount: 0,
          }]);
        };
        
        if (!userName) {
          addConversation();
        } else {
          return [...prev, {
            conversationId: 0,
            userId,
            userName,
            unreadCount: 0,
          }];
        }
      }
      return prev;
    });
  };

  const closeChat = (userId: number) => {
    setOpenChats(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  };

  const markAsRead = (conversationId: number) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.conversationId === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const getConversationId = (userId: number): number | undefined => {
    const conversation = conversations.find(conv => conv.userId === userId);
    return conversation?.conversationId;
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        openChats,
        totalUnreadCount,
        openChat,
        closeChat,
        markAsRead,
        getConversationId,
        isAuthenticated,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
