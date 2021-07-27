import squel from "squel"

export type User = {
  username: string
  forenames: string
  surname: string
  phoneNumber: string
  emailAddress: string
}

export type Users = User[]

export const getAllUsers = async (connection: any): Promise<Users> => {
  const query = squel
    .select()
    .field("username")
    .field("forenames")
    .field("surname")
    .field("phone_number")
    .field("email")
    .from("br7own.users")
    .toString()

  const users = await connection.any(query)

  return users.map((r: any) => ({
    username: r.username,
    forenames: r.forenames,
    surname: r.surname,
    phoneNumber: r.phone_number,
    emailAddress: r.email
  }))
}
