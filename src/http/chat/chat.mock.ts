import { Sender, type Chat, type Message } from './chat.model'
import type { CreateChatResponse, IChat } from './chat.interface'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const STORAGE_KEY = 'mock-chats'

export class MockChat implements IChat {
  private autoincrement_id = 1
  private chats: Record<Chat['id'], Chat> = {}

  constructor() {
    this.loadChats()
  }

  private loadChats() {
    if (typeof window === 'undefined') {
      return
    }
    const storedChats = window.sessionStorage.getItem(STORAGE_KEY)
    if (storedChats) {
      try {
        this.chats = JSON.parse(storedChats)
        // Find the highest id to continue autoincrement from there
        const maxId = Object.values(this.chats).reduce((max, chat) => {
          const chatMaxId = Math.max(...chat.messages.map((msg) => parseInt(msg.id)))
          return Math.max(max, chatMaxId)
        }, 0)
        if (maxId > 0) {
          this.autoincrement_id = maxId + 1
        }
      } catch (e) {
        console.error('Failed to load mock chats from session storage:', e)
        this.chats = {}
      }
    }
  }

  private saveChats() {
    if (typeof window === 'undefined') {
      return
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.chats))
  }

  async createChat(initialMessage: string): Promise<CreateChatResponse> {
    await wait(210) // fake wait time
    if (initialMessage.length === 0) {
      throw new Error('Message is empty')
    }

    const id = this.newId()
    const initialMessageId = this.newId()
    const initialResponseId = this.newId()

    const message: Message = {
      id: `${initialMessageId}`,
      content: initialMessage,
      sender: Sender.USER,
    }

    const response: Message = {
      id: `${initialResponseId}`,
      content: 'Olá, como eu posso te ajudar?',
      sender: Sender.ASSISTANT,
    }

    const chat: Chat = {
      id: `${id}`,
      messages: [message, response],
    }

    this.chats[chat.id] = chat
    this.saveChats()

    return { chatId: chat.id, response }
  }

  private newId(): number {
    return this.autoincrement_id++
  }

  async sendMessage(chatId: string, content: string): Promise<Message> {
    const chat = this.chats[chatId]
    if (!chat) {
      throw new Error('Chat not found!')
    }

    const message: Message = {
      id: `${this.newId()}`,
      content,
      sender: Sender.USER,
    }

    const responseContent = `This is an example generated response.
In an actual AI context, I would analyse your message to answer accordingly.

The message input received is: \`${content}\`.

**Markdown** *should* __be__ ~supported~`

    const response: Message = {
      id: `${this.newId()}`,
      content: responseContent,
      sender: Sender.ASSISTANT,
    }

    chat.messages.push(message, response)
    this.saveChats()
    return response
  }
}
