import type { Chat, Message } from './chat.model'

export interface IChat {
  createChat(initialMessage: string): Promise<CreateChatResponse>
  sendMessage(chatId: Chat['id'], message: string): Promise<Message>
  listMessages(chatId: Chat['id']): Promise<ListMessagesResponse>
}

export type CreateChatResponse = {
  chatId: Chat['id']
  response: Message
}

export type ListMessagesResponse = {
  chatId: Chat['id']
  messages: Message[]
}
