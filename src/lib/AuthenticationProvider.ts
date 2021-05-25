import { AuthenticationResult, UserCredentials } from "./User"

export interface AuthenticationProvider {
  authenticate(credentials: UserCredentials): AuthenticationResult
}
