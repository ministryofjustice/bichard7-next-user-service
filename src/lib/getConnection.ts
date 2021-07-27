import config from "lib/config"
import pgPromise from "pg-promise"

let connection: any

const getConnection = (): any => {
  if (connection) {
    return connection
  }

  const {
    databaseAuthenticator: { dbHost, dbPort, dbDatabase, dbUser, dbPassword, dbSsl }
  } = config

  connection = pgPromise()({
    host: dbHost,
    port: dbPort,
    database: dbDatabase,
    user: dbUser,
    password: dbPassword,
    ssl: dbSsl
  })

  return connection
}

export default getConnection
