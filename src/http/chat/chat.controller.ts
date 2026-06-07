import { api } from '../api'
import type { CreateChatResponse, IChat, ListMessagesResponse } from './chat.interface'
import type { Chat, Message } from './chat.model'

export class ChatController implements IChat {
  async createChat(initialMessage: string): Promise<CreateChatResponse> {
    return await api.post<CreateChatResponse>('/chats', { initialMessage })
  }

  async sendMessage(chatId: Chat['id'], message: string): Promise<Message> {
    const url = `/chats/${chatId}/messages`
    return await api.post<Message>(url, { message })
  }

  async listMessages(chatId: Chat['id']): Promise<ListMessagesResponse> {
    const url = `/chats/${chatId}/messages`
    return await api.get<ListMessagesResponse>(url)
  }
}
