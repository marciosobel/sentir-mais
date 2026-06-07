import type { Auth, User } from './auth.model'

export interface IAuth {
  login(email: string, password: string): Promise<Auth>
  register(email: string, password: string): Promise<Auth>
  getCurrentUser(): Promise<User>
}
