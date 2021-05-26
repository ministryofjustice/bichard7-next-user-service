import AuthenticationProvider from "lib/AuthenticationProvider"
import { User, UserCredentials } from "lib/User"
import { AuthenticationResult, Token, TokenPayload } from "lib/AuthenticationResult"
import jwt from "jsonwebtoken"
import config from "lib/config"
import users from "data/users"

export default class LocalAuthenticator implements AuthenticationProvider {
  // eslint-disable-next-line class-methods-use-this
  public authenticate(credentials: UserCredentials): AuthenticationResult {
    const [match] = users.filter(
      (u) => u.emailAddress === credentials.emailAddress && u.password === credentials.password
    )

    return match ? LocalAuthenticator.generateToken(match) : new Error("Invalid credentials")
  }

  private static generateToken(user: User): Token {
    const payload: TokenPayload = {
      username: user.username,
      exclusionList: user.exclusionList,
      inclusionList: user.inclusionList,
      forenames: user.forenames,
      surname: user.surname,
      emailAddress: user.emailAddress,
      groups: user.groups
    }

    const options: jwt.SignOptions = {
      expiresIn: config.localAuthenticator.jwtExpiresIn
    }

    return jwt.sign(payload, config.localAuthenticator.jwtSecret, options)
  }
}
