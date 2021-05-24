import LocalAuthenticator from "lib/AuthenticationProvider/LocalAuthenticator"

export interface User {
  emailAddress: string
  password: string
}

export interface AuthenticatedUser extends User {
  authenticated: boolean
}

export interface AuthenticationProvider {
  authenticate(user: User): boolean
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

  public static authenticate(user: User): AuthenticatedUser {
    const authenticated = Authenticator.getProvider().authenticate(user)

    return {
      ...user,
      authenticated
    }
  }
}
