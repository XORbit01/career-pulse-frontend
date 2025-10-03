import api from "./api";

export interface ChatMessage {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  conversation_id: number;
  timestamp: string;
  read: boolean;
}

export interface SendMessageRequest {
  content: string;
  receiver_id: number;
}

export interface ChatResponse {
  data: ChatMessage;
  message: string;
  success: boolean;
}

export interface MessagesResponse {
  data: ChatMessage[];
  message: string;
  success: boolean;
}

export interface ReadResponse {
  data: string;
  message: string;
  success: boolean;
}

export interface ConversationData {
  id: number;
  participant_one_id: number;
  participant_two_id: number;
  message_count: number;
  created_at: string;
}

export interface ConversationsResponse {
  data: {
    conversations: ConversationData[] | null;
    total: number;
  };
  message: string;
  success: boolean;
}

export interface Conversation {
  conversationId: number;
  userId: number;
  userName: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

class ChatService {
  static async sendMessage(userId: number, messageData: SendMessageRequest): Promise<ChatResponse> {
    const response = await api.post(`/chats/${userId}/messages`, messageData);
    return response.data;
  }

  static async getMessages(conversationId: number): Promise<MessagesResponse> {
    const response = await api.get(`/chats/${conversationId}/messages`);
    return response.data;
  }

  static async markAsRead(conversationId: number): Promise<ReadResponse> {
    const response = await api.put(`/chats/${conversationId}/read`);
    return response.data;
  }

  static async getConversations(): Promise<ConversationsResponse> {
    try {
      const response = await api.get("/chats/");
      return response.data;
    } catch (error) {
      // Fallback for when endpoint doesn't exist yet
      return {
        data: { conversations: [], total: 0 },
        message: "No conversations found",
        success: true
      };
    }
  }

  static async getUnreadCount(): Promise<{ data: number; success: boolean }> {
    try {
      const response = await api.get("/chats/unread-count");
      return response.data;
    } catch (error) {
      return { data: 0, success: false };
    }
  }
}

export default ChatService;
