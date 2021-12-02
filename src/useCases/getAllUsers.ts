import config from "lib/config"
import Database from "types/Database"
import PaginatedResult from "types/PaginatedResult"
import PromiseResult from "types/PromiseResult"
import UserFullDetails from "types/UserFullDetails"

const getAllUsers = async (
  connection: Database,
  visibleForces: string,
  page: number = 0
): PromiseResult<PaginatedResult<Pick<UserFullDetails, "username" | "forenames" | "surname" | "emailAddress">[]>> => {
  const forces = visibleForces.split(",")

  // Confusing escaping here... We're generating the following for each force:
  //   visible_forces ~ concat('\y', $1, '\y')
  // Where:
  //   - concat() is the postgres function for concatenating strings
  //   - \y is the postgres regex for "word boundary"; and
  //   - $1 is the placeholder for the variable substitution, and increments for each force
  const forceWhere = forces.map((_, i) => `visible_forces ~ concat('\\y', \$${i + 1}, '\\y')`).join(" OR ")

  const getAllUsersQuery = `
      SELECT
        username,
        forenames,
        surname,
        email,
        COUNT(*) OVER() as all_users
      FROM br7own.users
      WHERE deleted_at IS NULL
        AND ( ${forceWhere} )
      ORDER BY username
        OFFSET ${page * config.maxUsersPerPage} ROWS
        FETCH NEXT ${config.maxUsersPerPage} ROWS ONLY
    `

  console.log(getAllUsersQuery)
  // console.log(forces)

  let users
  try {
    users = await connection.any(getAllUsersQuery, forces)
  } catch (error) {
    return error as Error
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
