import UsersProvider from "lib/UsersProvider"
import { ListUsersResult } from "lib/UsersResult"
import config from "lib/config"
import { Client } from "pg"

export default class DatabaseUsers implements UsersProvider {
  private dbClient: Client

  constructor() {
    this.dbClient = new Client({
      user: config.databaseAuthenticator.dbUser,
      host: config.databaseAuthenticator.dbHost,
      database: config.databaseAuthenticator.dbDatabase,
      password: config.databaseAuthenticator.dbPassword,
      port: config.databaseAuthenticator.dbPort,
      ssl: config.databaseAuthenticator.dbSsl ? { rejectUnauthorized: false } : false
    })
    this.dbClient.connect()
  }

  public async list(): Promise<ListUsersResult> {
    const query = `
      SELECT
        username,
        forenames,
        surname,
        phone_number,
        email
      FROM br7own.users
    `
    const res = await this.dbClient.query(query)
    return res.rows.map((r) => ({
      username: r.username,
      forenames: r.forenames,
      surname: r.surname,
      phoneNumber: r.phone_number,
      emailAddress: r.email
    })) as unknown as ListUsersResult
  }
}
