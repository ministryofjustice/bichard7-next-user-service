import pgPromise from "pg-promise"
import config from "lib/config"

const pgp = pgPromise()

const db = pgp({
  host: config.databaseAuthenticator.dbHost,
  port: config.databaseAuthenticator.dbPort,
  database: config.databaseAuthenticator.dbDatabase,
  user: config.databaseAuthenticator.dbUser,
  password: config.databaseAuthenticator.dbPassword,
  ssl: config.databaseAuthenticator.dbSsl ? { rejectUnauthorized: false } : false
})

export default db
