import config from "lib/config"
import pgPromise, { IDatabase } from "pg-promise"
import Database from "types/Database"
import createSingleton from "./createSingleton"

const {
  database: { host, port, database, user, password, ssl }
} = config

interface IDatabaseScope {
  db: IDatabase<any>
}

const getConnection = (): Database => {
  return createSingleton<IDatabaseScope>("users-service-connection", () => {
    return {
      db: pgPromise()({
        host,
        port,
        database,
        user,
        password,
        ssl: ssl ? { rejectUnauthorized: false } : false
      })
    }
  }).db
}

export default getConnection
