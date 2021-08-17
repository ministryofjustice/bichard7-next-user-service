import config from "lib/config"
import pgPromise from "pg-promise"
import Database from "types/Database"

let connection: Database

const getConnection = (): Database => {
  if (connection) {
    return connection
  }

  const {
    database: { host, port, database, user, password, ssl }
  } = config

  connection = pgPromise()({
    host,
    port,
    database,
    user,
    password,
    ssl: ssl ? { rejectUnauthorized: false } : false
  })

  return connection
}

export default getConnection
