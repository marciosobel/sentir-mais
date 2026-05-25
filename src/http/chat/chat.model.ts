export type Chat = {
  id: string
  messages: Message[]
}

export type Message = {
  id: string
  content: string
  sender: Sender
}

export enum Sender {
  USER,
  ASSISTANT,
}
