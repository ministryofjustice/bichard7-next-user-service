import AuthenticationProvider from "lib/AuthenticationProvider"
import { User, UserCredentials } from "lib/User"
import { AuthenticationResult, Token } from "lib/AuthenticationResult"
import jwt from "jsonwebtoken"
import config from "lib/config"

export default class LocalAuthenticator implements AuthenticationProvider {
  private static readonly users: Array<UserCredentials & User> = [
    {
      emailAddress: "bichard01@example.com",
      password: "password",
      displayName: "Bichard01",
      role: "B7Allocator"
    },
    {
      emailAddress: "b7exceptionhandler@example.com",
      password: "password",
      displayName: "B7ExceptionHandler",
      role: "B7ExceptionHandler"
    }
  ]

  // eslint-disable-next-line class-methods-use-this
  public authenticate(credentials: UserCredentials): AuthenticationResult {
    const [match] = LocalAuthenticator.users.filter(
      (u) => u.emailAddress === credentials.emailAddress && u.password === credentials.password
    )

    if (match) {
      const { displayName, emailAddress, role } = match
      return LocalAuthenticator.generateToken({ displayName, emailAddress, role })
    }

    return new Error("Invalid credentials")
  }

  private static generateToken(user: User): Token {
    const options = {
      expiresIn: config.localAuthenticator.jwtExpiresIn
    }
    return jwt.sign(user, config.localAuthenticator.jwtSecret, options)
  }
}
