import LocalUsers from "lib/UsersProvider/LocalUsers"
import DatabaseUsers from "./UsersProvider/DatabaseUsers"
import UsersProvider from "./UsersProvider"
import { ListUsersResult } from "./UsersResult"
import config from "./config"

export default class Users {
  private static provider?: UsersProvider

  public static getProvider(): UsersProvider {
    if (!Users.provider) {
      if (config.authenticator === "DB") {
        Users.provider = new DatabaseUsers()
      } else {
        Users.provider = new LocalUsers()
      }
    }

    return Users.provider
  }

  public static clearProvider() {
    Users.provider = undefined
  }

  public static async list(): Promise<ListUsersResult> {
    const result = await Users.getProvider().list()
    return result
  }
}
