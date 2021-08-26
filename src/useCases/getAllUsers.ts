import Database from "types/Database"
import UserDetails from "types/UserDetails"

const getAllUsers = async (connection: Database): Promise<Partial<UserDetails>[]> => {
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
      ORDER BY username
    `
  try {
    users = await connection.any(getAllUsersQuery)
  } catch (error) {
    return error
  }

  return users.map((r: { [key: string]: string }) => ({
    username: r.username,
    forenames: r.forenames,
    surname: r.surname,
    phoneNumber: r.phone_number,
    emailAddress: r.email
  }))
}

export default getAllUsers
