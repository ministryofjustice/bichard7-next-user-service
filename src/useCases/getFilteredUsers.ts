import Database from "types/Database"
import UserDetails from "types/UserDetails"

const getFilteredUsers = async (connection: Database, filter: string): Promise<Partial<UserDetails>[]> => {
  let users
  const getAllUsersQuery = `
      SELECT
        id,
        username,
        forenames,
        surname,
        phone_number,
        email
      FROM br7own.users
      WHERE deleted_at IS NULL
        AND (LOWER(username) LIKE LOWER($1) OR
        LOWER(email) LIKE LOWER($1) OR
        LOWER(forenames) LIKE LOWER($1) OR
        LOWER(surname) LIKE LOWER($1) )
      ORDER BY username
    `
  try {
    users = await connection.any(getAllUsersQuery, [`%${filter}%`])
  } catch (error) {
    return error
  }

  return users.map((r: any) => ({
    id: r.id,
    username: r.username,
    forenames: r.forenames,
    surname: r.surname,
    phoneNumber: r.phone_number,
    emailAddress: r.email
  }))
}

export default getFilteredUsers
