import config from "lib/config"
import pgPromise from "pg-promise"

let connection: any

const getConnection = (): any => {
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
    ssl
  })

  return connection
}

export default getConnection
