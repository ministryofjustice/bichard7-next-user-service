import { DBResult, TransformResult } from "../types"
import { GetAllUsers, User } from "../queries/users"

export type TUser = {
  username: string
  forenames: string
  surname: string
  phoneNumber: string
  emailAddress: string
}

export type AllUsers = TUser[]

export const getAllUsers = (dbResult: DBResult<GetAllUsers>): TransformResult<AllUsers> =>
  dbResult.map((r: User) => ({
    username: r.username,
    forenames: r.forenames,
    surname: r.surname,
    phoneNumber: r.phone_number,
    emailAddress: r.email
  }))
