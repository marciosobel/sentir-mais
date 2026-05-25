import type { IChat } from './chat.interface'
import { MockChat } from './chat.mock'

let currentChat: IChat | undefined

export function useChat(): IChat {
  return (currentChat ??= new MockChat())
}

export * from './chat.interface'
export * from './chat.model'
