import Database from "types/Database"
import config from "./config"
import createSingletonConnection from "./createSingletonConnection"

const getConnection = (): Database => {
  return createSingletonConnection("users-service-connection", config.database)
}

export default getConnection
