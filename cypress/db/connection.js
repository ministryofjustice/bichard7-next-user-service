const pgPromise = require("pg-promise")

const config = {
  dbHost: process.env.DB_AUTH_HOST || "localhost",
  dbUser: process.env.DB_AUTH_USER || "bichard",
  dbPassword: process.env.DB_AUTH_PASSWORD || "password",
  dbDatabase: process.env.DB_AUTH_DATABASE || "bichard",
  dbPort: parseInt(process.env.DB_AUTH_PORT || "5432", 10),
  dbSsl: process.env.DB_AUTH_SSL === "true"
}

let connection

const getConnection = () => {
  if (connection) {
    return connection
  }

  const { dbHost, dbPort, dbDatabase, dbUser, dbPassword, dbSsl } = config

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

module.exports = getConnection
