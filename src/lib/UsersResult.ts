import { User } from "./User"

export type ListUsersResultRow = Pick<User, "username" | "forenames" | "surname" | "phoneNumber" | "emailAddress">[]
export type ListUsersResult = ListUsersResultRow[]

export function isError(result: ListUsersResult | Error): result is Error {
  return result instanceof Error
}

export function isSuccess(result: ListUsersResult | Error): result is ListUsersResult {
  return !isError(result)
}
