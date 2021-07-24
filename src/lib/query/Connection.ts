import config, { UserServiceConfig } from "lib/config"
import pgPromise from "pg-promise"
import { DBResult } from "./types"

export default class Connection {
  private static connection: any

  public static getConnection() {
    if (!Connection.connection) {
      Connection.connection = new Connection(config)
    }
    return Connection.connection
  }

  public static any<O>(query: string, params: any[] = []): DBResult<O> {
    return Connection.getConnection().any(query, params)
  }

  constructor(c: UserServiceConfig) {
    const {
      databaseAuthenticator: { dbHost, dbPort, dbDatabase, dbUser, dbPassword, dbSsl }
    } = c
    return pgPromise()({
      host: dbHost,
      port: dbPort,
      database: dbDatabase,
      user: dbUser,
      password: dbPassword,
      ssl: dbSsl
    })
  }
}
