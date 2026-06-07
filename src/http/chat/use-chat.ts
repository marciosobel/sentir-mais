import { ChatController } from './chat.controller'
import type { IChat } from './chat.interface'

let currentChat: IChat | undefined

export function useChat(): IChat {
  return (currentChat ??= new ChatController())
}
