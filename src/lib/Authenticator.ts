import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"
import AuthenticationProvider from "./AuthenticationProvider"
import { UserCredentials } from "./User"
import { AuthenticationResult } from "./AuthenticationResult"
import DatabaseAuthenticator from "./AuthenticationProvider/DatabaseAuthenticator"
import config from "./config"

export default class Authenticator {
  private static provider?: AuthenticationProvider

  public static getProvider(): AuthenticationProvider {
    if (!Authenticator.provider) {
      if (config.authenticator === "DB") {
        Authenticator.provider = new DatabaseAuthenticator()
      } else {
        Authenticator.provider = new LocalAuthenticator()
      }
    }

    return Authenticator.provider
  }

  public static clearProvider() {
    Authenticator.provider = undefined
  }

  public static async authenticate(credentials: UserCredentials): Promise<AuthenticationResult> {
    const result = await Authenticator.getProvider().authenticate(credentials)
    return result
  }
}
