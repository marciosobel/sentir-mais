import { AuthController } from './auth.controller'
import type { IAuth } from './auth.interface'

let currentProvider: IAuth | undefined = undefined

export function useAuth(): IAuth {
  return (currentProvider ??= new AuthController())
}
