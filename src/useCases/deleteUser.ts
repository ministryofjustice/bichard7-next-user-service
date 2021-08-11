import { IncomingMessage } from "http"
import { User } from "types/User"
import Database from "types/Database"
import { isError } from "types/Result"
import markUserAsDeleted from "./markUserAsDeleted"
import validateDeleteUserRequest from "./validateDeleteUserRequest"

interface DeleteUserResult {
  validationFailed?: boolean
  serverSideError?: Error
  isDeleted?: boolean
}

export default async (db: Database, request: IncomingMessage, user: User): Promise<DeleteUserResult> => {
  const validationResult = await validateDeleteUserRequest(user, request)

  if (!validationResult) {
    return { validationFailed: true }
  }

  const markUserAsDeletedResult = await markUserAsDeleted(db, user.emailAddress)

  if (isError(markUserAsDeletedResult)) {
    return { serverSideError: markUserAsDeletedResult }
  }

  return { isDeleted: true }
}
