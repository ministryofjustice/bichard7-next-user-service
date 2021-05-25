import AuthenticationProvider from "lib/AuthenticationProvider"
import { User, UserCredentials } from "lib/User"
import { AuthenticationResult, Token } from "lib/AuthenticationResult"
import jwt from "jsonwebtoken"

export default class LocalAuthenticator implements AuthenticationProvider {
  private static readonly users: [UserCredentials] = [{ emailAddress: "bichard01@example.com", password: "password" }]

  public authenticate(credentials: UserCredentials): AuthenticationResult {
    const [match] = LocalAuthenticator.users.filter(
      (u) => u.emailAddress === credentials.emailAddress && u.password === credentials.password
    )

    if (match) {
      return this.generateToken({
        emailAddress: match.emailAddress
      })
    }

    return new Error("Invalid credentials")
  }

  // eslint-disable-next-line class-methods-use-this
  private generateToken(user: User): Token {
    return jwt.sign(user, "super-secret-secret", { expiresIn: "10 seconds" })
  }
}
