export type User = {
  username: string
  forenames: string
  surname: string
  phoneNumber: string
  emailAddress: string
}

export type Users = User[]

const getAllUsers = async (connection: any, onError: (e: Error) => void): Promise<Users> => {
  let users

  const getAllUsersQuery = `
      SELECT
        username,
        forenames,
        surname,
        phone_number,
        email
      FROM br7own.users
    `
  try {
    users = await connection.any(getAllUsersQuery)
  } catch (e) {
    onError(e)
  }

  return users.map((r: any) => ({
    username: r.username,
    forenames: r.forenames,
    surname: r.surname,
    phoneNumber: r.phone_number,
    emailAddress: r.email
  }))
}

export default getAllUsers
