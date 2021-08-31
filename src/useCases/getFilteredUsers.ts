import config from "lib/config"
import Database from "types/Database"
import PaginatedResult from "types/PaginatedResult"
import PromiseResult from "types/PromiseResult"
import UserDetails from "types/UserDetails"

const getFilteredUsers = async (
  connection: Database,
  filter: string,
  page = 0
): PromiseResult<PaginatedResult<Partial<UserDetails>[]>> => {
  let users
  const getFilteredUsersQuery = `
      SELECT
        id,
        username,
        forenames,
        surname,
        phone_number,
        email,
        COUNT(*) OVER() as all_users
      FROM br7own.users
      WHERE deleted_at IS NULL
        AND (LOWER(username) LIKE LOWER($1) OR
        LOWER(email) LIKE LOWER($1) OR
        LOWER(forenames) LIKE LOWER($1) OR
        LOWER(surname) LIKE LOWER($1) )
      ORDER BY username
        OFFSET ${page * config.maxUsersPerPage} ROWS
        FETCH NEXT ${config.maxUsersPerPage} ROWS ONLY
    `
  try {
    users = await connection.any(getFilteredUsersQuery, [`%${filter}%`])
  } catch (error) {
    return error
  }

  return {
    result: users.map((r: { [key: string]: string }) => ({
      id: r.id,
      username: r.username,
      forenames: r.forenames,
      surname: r.surname,
      phoneNumber: r.phone_number,
      emailAddress: r.email
    })),
    totalElements: users.length === 0 ? 0 : users[0].all_users
  }
}

export default getFilteredUsers
