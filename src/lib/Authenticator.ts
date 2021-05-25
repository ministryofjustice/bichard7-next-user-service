import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import AuthenticationProvider from "./AuthenticationProvider"
import { UserCredentials } from "./User"
import { AuthenticationResult } from "./AuthenticationResult"

export default class Authenticator {
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
