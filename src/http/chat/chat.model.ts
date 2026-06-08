export type Chat = {
  id: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export type ChatListItem = {
  id: string
  createdAt: string
  updatedAt: string
  lastMessagePreview: string
  lastMessageAt: string
}

export type Message = {
  id: string
  content: string
  sender: Sender
}

export enum Sender {
  USER = 0,
  ASSISTANT = 1,
}
