import { api } from '../api'
import type { IAuth } from './auth.interface'
import type { Auth } from './auth.model'

export class AuthController implements IAuth {
  async login(email: string, password: string): Promise<Auth> {
    return await api.post('/auth/login', {
      email,
      password,
    })
  }

  async register(email: string, password: string): Promise<Auth> {
    return await api.post('/auth/register', {
      email,
      password,
    })
  }
}
