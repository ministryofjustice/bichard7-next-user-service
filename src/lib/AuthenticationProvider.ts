import { UserCredentials } from "./User"
import { AuthenticationResult } from "./AuthenticationResult"

export default interface AuthenticationProvider {
  authenticate(credentials: UserCredentials): AuthenticationResult
}
