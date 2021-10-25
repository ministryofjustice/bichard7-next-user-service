import Database from "types/Database"
import { isError } from "types/Result"
import getUsersLastLogin from "./getUsersLastLogin"

export default async (connection: Database, emailAddress: string): Promise<boolean> => {
  const lastLogIn = await getUsersLastLogin(connection, emailAddress)
  if (!lastLogIn || isError(lastLogIn)) {
    return true
  }
  return false
}
