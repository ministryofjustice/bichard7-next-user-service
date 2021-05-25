import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import { AuthenticationResult, UserCredentials } from "./User"

export interface AuthenticationProvider {
  authenticate(credentials: UserCredentials): AuthenticationResult
}

export class Authenticator {
  private static provider: AuthenticationProvider

  public static getProvider(): AuthenticationProvider {
    if (!Authenticator.provider) {
      // TODO: Add logic here to choose between Local/Cognito authentication
      Authenticator.provider = new LocalAuthenticator()
    }

    return Authenticator.provider
  }

  public static authenticate(credentials: UserCredentials): AuthenticationResult {
    return Authenticator.getProvider().authenticate(credentials)
  }
}
