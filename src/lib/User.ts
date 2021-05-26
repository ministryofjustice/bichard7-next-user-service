export interface UserCredentials {
  emailAddress: string
  password: string
}

export type UserRole = "B7Allocator" | "B7ExceptionHandler"

export interface User {
  displayName: string
  emailAddress: string
  role: UserRole
}
