
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ChatService from "@/services/chat-service";
import ProfileService from "@/services/profile-service";
import AuthService from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/context/chat-context";

export const useChatBox = (receiverId: number, receiverName: string) => {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUserId = AuthService.getUserId();
  const { markAsRead, getConversationId } = useChat();
  const isAuthenticated = AuthService.isAuthenticated();

  // Fetch receiver's profile to get proper display name
  const { data: receiverProfile } = useQuery({
    queryKey: ['profile', receiverId.toString()],
    queryFn: () => ProfileService.getProfileById(receiverId.toString()),
    enabled: !!receiverId && isAuthenticated,
  });

  // Get proper display name from profile
  const getDisplayName = () => {
    if (!receiverProfile) return receiverName;
    
    if (receiverProfile.profileType === 'job_seeker') {
      const firstName = receiverProfile.first_name || '';
      const lastName = receiverProfile.last_name || '';
      return `${firstName} ${lastName}`.trim() || receiverName;
    } else {
      return receiverProfile.company_name || receiverName;
    }
  };

  // Get conversation ID from context
  useEffect(() => {
    const convId = getConversationId(receiverId);
    if (convId) {
      setConversationId(convId);
    }
  }, [receiverId, getConversationId]);

  // Fetch messages with 5-second refresh
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['chatMessages', conversationId],
    queryFn: () => conversationId ? ChatService.getMessages(conversationId) : Promise.resolve({ data: [], success: true, message: '' }),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    enabled: !!conversationId && isAuthenticated,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: { content: string; receiver_id: number }) => 
      ChatService.sendMessage(receiverId, messageData),
    onSuccess: (response) => {
      // Update conversation ID if this was the first message
      if (response.data.conversation_id && !conversationId) {
        setConversationId(response.data.conversation_id);
      }
      queryClient.invalidateQueries({ queryKey: ['chatMessages', conversationId || response.data.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.error('Send message error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: () => conversationId ? ChatService.markAsRead(conversationId) : Promise.reject('No conversation ID'),
    onSuccess: () => {
      if (conversationId) {
        markAsRead(conversationId);
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      console.error("Failed to mark messages as read");
    }
  });

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (messagesData?.data && messagesData.data.length > 0 && conversationId) {
      const unreadMessages = messagesData.data.filter(
        msg => msg.receiver_id === currentUserId && !msg.read
      );
      if (unreadMessages.length > 0) {
        markAsReadMutation.mutate();
      }
    }
  }, [messagesData?.data, currentUserId, conversationId]);

  const handleSendMessage = (messageContent: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send messages.",
        variant: "destructive"
      });
      return;
    }

    sendMessageMutation.mutate({
      content: messageContent,
      receiver_id: receiverId
    });
  };

  return {
    messagesData,
    isLoading,
    isAuthenticated,
    currentUserId,
    getDisplayName,
    handleSendMessage,
    isSending: sendMessageMutation.isPending,
  };
};
