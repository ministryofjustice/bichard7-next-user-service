import pgPromise, { IDatabase } from "pg-promise"
import DatabaseConfig from "./DatabaseConfig"

export default function createSingletonConnection(name: string, config: DatabaseConfig): IDatabase<any> {
  const symbol = Symbol.for(name)
  let scope = (global as any)[symbol]
  if (!scope) {
    // generate connection and cache it in global
    scope = pgPromise()({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false
    })
    ;(global as any)[symbol] = scope
  }
  return scope
}
