export type User = {
  username: string
  forenames: string
  surname: string
  phoneNumber: string
  emailAddress: string
}

export type Users = User[]

const getAllUsers = async (connection: any): Promise<Users> => {
  let users

  const getAllUsersQuery = `
      SELECT
        username,
        forenames,
        surname,
        phone_number,
        email
      FROM br7own.users
      WHERE deleted_at IS NULL
    `
  try {
    users = await connection.any(getAllUsersQuery)
  } catch (error) {
    return error
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
