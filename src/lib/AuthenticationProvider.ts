import jwt from "jsonwebtoken"
import config from "lib/config"
import { AuthenticationResult } from "lib/AuthenticationResult"
import { Token, TokenPayload } from "lib/Token"
import { User, UserCredentials } from "lib/User"

export default abstract class AuthenticationProvider {
  abstract authenticate(credentials: UserCredentials): Promise<AuthenticationResult>

  protected static generateToken(user: User): Token {
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
      expiresIn: config.tokenExpiresIn,
      issuer: config.tokenIssuer
    }

    return jwt.sign(payload, config.tokenSecret, options)
  }
}
