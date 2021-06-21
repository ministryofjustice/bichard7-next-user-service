import AuthenticationProvider from "lib/AuthenticationProvider"
import { AuthenticationResult } from "lib/AuthenticationResult"
import { UserCredentials } from "lib/User"
import users from "data/users"

export default class LocalAuthenticator extends AuthenticationProvider {
  // eslint-disable-next-line class-methods-use-this
  public authenticate(credentials: UserCredentials): AuthenticationResult {
    const [match] = users.filter(
      (u) => u.emailAddress === credentials.emailAddress && u.password === credentials.password
    )

    return match ? AuthenticationProvider.generateToken(match) : new Error("Invalid credentials")
  }
}
