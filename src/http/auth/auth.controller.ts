import { api } from '../api'
import type { IAuth } from './auth.interface'
import type { Auth, User } from './auth.model'

export class AuthController implements IAuth {
  async login(email: string, password: string): Promise<Auth> {
    return await api.post<Auth>('/auth/login', {
      email,
      password,
    })
  }

  async register(email: string, password: string): Promise<Auth> {
    return await api.post<Auth>('/auth/register', {
      email,
      password,
    })
  }

  async getCurrentUser(): Promise<User> {
    return await api.get<User>('/auth/me')
  }
}
