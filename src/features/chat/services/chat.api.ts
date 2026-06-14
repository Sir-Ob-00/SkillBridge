import { apiClient } from '@services/api/client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, Chat, Message, PaginatedResponse } from '@types/index';

export const chatApi = {
  listChats: async () => {
    const { data } = await apiClient.get<ApiResponse<Chat[]>>(
      API_ROUTES.CHAT.LIST
    );
    return data.data;
  },

  getMessages: async (chatId: string, page = 1, pageSize = 30) => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Message>>
    >(API_ROUTES.CHAT.MESSAGES(chatId), { params: { page, pageSize } });
    return data.data;
  },
};
