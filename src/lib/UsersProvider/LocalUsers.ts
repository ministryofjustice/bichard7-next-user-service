import UsersProvider from "lib/UsersProvider"
import { ListUsersResult } from "lib/UsersResult"
import users from "data/users"

export default class LocalUsers implements UsersProvider {
  // eslint-disable-next-line class-methods-use-this, require-await
  public async list(): Promise<ListUsersResult> {
    return users.map((u) => ({
      username: u.username,
      forenames: u.forenames,
      surname: u.surname,
      phoneNumber: u.phoneNumber,
      emailAddress: u.emailAddress
    })) as unknown as Promise<ListUsersResult>
  }
}
