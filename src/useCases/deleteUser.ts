import User from "types/User"
import Database from "types/Database"
import { isError } from "types/Result"
import AuditLogger from "types/AuditLogger"
import markUserAsDeleted from "./markUserAsDeleted"

interface DeleteUserResult {
  serverSideError?: Error
  isDeleted?: boolean
}

export default async (db: Database, auditLogger: AuditLogger, user: Partial<User>, currentUserId: number): Promise<DeleteUserResult> => {
  const markUserAsDeletedResult = await markUserAsDeleted(db, user.emailAddress as string, currentUserId)

  if (isError(markUserAsDeletedResult)) {
    return { serverSideError: markUserAsDeletedResult }
  }

  await auditLogger("Delete user", { user })

  return { isDeleted: true }
}
