import User from "types/User"
import Database from "types/Database"
import { isError } from "types/Result"
import markUserAsDeleted from "./markUserAsDeleted"

interface DeleteUserResult {
  serverSideError?: Error
  isDeleted?: boolean
}

export default async (db: Database, user: User): Promise<DeleteUserResult> => {
  const markUserAsDeletedResult = await markUserAsDeleted(db, user.emailAddress)

  if (isError(markUserAsDeletedResult)) {
    return { serverSideError: markUserAsDeletedResult }
  }

  return { isDeleted: true }
}
