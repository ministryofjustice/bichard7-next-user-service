import config from "lib/config"
import Database from "types/Database"
import PaginatedResult from "types/PaginatedResult"
import PromiseResult from "types/PromiseResult"
import UserMainDetails from "types/UserMainDetails"

const getAllUsers = async (connection: Database, page: number): PromiseResult<PaginatedResult<UserMainDetails[]>> => {
  let users

  const getAllUsersQuery = `
      SELECT
        username,
        forenames,
        surname,
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
      emailAddress: r.email
    })),
    totalElements: users.length === 0 ? 0 : users[0].all_users
  }
}

export default getAllUsers
