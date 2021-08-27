import config from "lib/config"
import Database from "types/Database"
import PaginatedResult from "types/PaginatedResult"
import PromiseResult from "types/PromiseResult"
import UserDetails from "types/UserDetails"

const getAllUsers = async (
  connection: Database,
  page: number
): PromiseResult<PaginatedResult<Partial<UserDetails>[]>> => {
  let users

  const getAllUsersQuery = `
      SELECT
        username,
        forenames,
        surname,
        phone_number,
        email,
        COUNT(*) OVER() as all_users
      FROM br7own.users
      WHERE deleted_at IS NULL
      ORDER BY username
        OFFSET ${page * config.maxUsersPerPage} ROWS
        FETCH NEXT ${config.maxUsersPerPage} ROWS ONLY
    `
  try {
    users = await connection.any(getAllUsersQuery)
  } catch (error) {
    return error
  }

  return {
    result: users.map((r: { [key: string]: string }) => ({
      username: r.username,
      forenames: r.forenames,
      surname: r.surname,
      phoneNumber: r.phone_number,
      emailAddress: r.email
    })),
    totalElements: users.length === 0 ? 0 : users[0].all_users
  }
}

export default getAllUsers
