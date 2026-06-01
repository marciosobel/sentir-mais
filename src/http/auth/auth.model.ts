export type Auth = {
  accessToken: string
  user: User
}

export type User = {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}
