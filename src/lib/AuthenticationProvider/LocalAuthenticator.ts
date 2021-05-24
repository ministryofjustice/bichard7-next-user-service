import { AuthenticationProvider, User } from "lib/Authenticator"

export default class LocalAuthenticator implements AuthenticationProvider {
  private static readonly users: [User] = [{ emailAddress: "bichard01@example.com", password: "password" }]

  // eslint-disable-next-line class-methods-use-this
  public authenticate(user: User): boolean {
    const matchingUsers = LocalAuthenticator.users.filter(
      (u) => u.emailAddress === user.emailAddress && u.password === user.password
    )

    return matchingUsers.length > 0
  }
}
