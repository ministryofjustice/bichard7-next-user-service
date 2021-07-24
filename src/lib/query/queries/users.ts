import squel, { QueryBuilder } from "squel"

export type User = {
  username: string
  forenames: string
  surname: string
  phone_number: string
  email: string
}

export type GetAllUsers = User[]

export const getAllUsers: QueryBuilder = squel
  .select()
  .field("username")
  .field("forenames")
  .field("surname")
  .field("phone_number")
  .field("email")
  .from("br7own.users")
