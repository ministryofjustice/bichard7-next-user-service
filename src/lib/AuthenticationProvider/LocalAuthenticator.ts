import AuthenticationProvider from "lib/AuthenticationProvider"
import { UserCredentials } from "lib/User"
import { AuthenticationResult } from "lib/AuthenticationResult"

export default class LocalAuthenticator implements AuthenticationProvider {
  private static readonly users: [UserCredentials] = [{ emailAddress: "bichard01@example.com", password: "password" }]

  // eslint-disable-next-line class-methods-use-this
  public authenticate(credentials: UserCredentials): AuthenticationResult {
    const [match] = LocalAuthenticator.users.filter(
      (u) => u.emailAddress === credentials.emailAddress && u.password === credentials.password
    )

    return match ? { emailAddress: match.emailAddress } : new Error("Invalid credentials")
  }
}
