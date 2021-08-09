import pgPromise from "pg-promise"
import config from "lib/config"
import Database from "types/Database"

const pgp = pgPromise()

const db: Database = pgp({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false
})

export default db
