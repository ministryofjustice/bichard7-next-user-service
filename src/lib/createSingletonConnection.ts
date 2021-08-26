import pgPromise, { IDatabase } from "pg-promise"
import DatabaseConfig from "./DatabaseConfig"

const createSingletonConnection = (name: string, config: DatabaseConfig, attachEvents: boolean): IDatabase<any> => {
  const connectionName = Symbol.for(name) as symbol
  let scope = (global as any)[connectionName as any]
  if (!scope) {
    scope = pgPromise(
      attachEvents
        ? {
            query(e) {
              console.log(`QUERY: ${e.query} PARAMS: ${e.params}`)
            },
            error(err, e) {
              console.error(err)

              if (e.cn) {
                console.error(`CONNECTION ERROR. QUERY: ${e.query}. PARAMS: ${e.params}`)
              }

              if (e.query) {
                console.error(`QUERY ERROR: QUERY: ${e.query} PARAMS: ${e.params}`)
              }

              if (e.ctx) {
                console.error(`CONTEXT: ${e.ctx}`)
              }
            }
          }
        : {}
    )({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false
    })
    ;(global as any)[connectionName as any] = scope
  }

  return scope
}

export default createSingletonConnection
