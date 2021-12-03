import config from "lib/config"
import Database from "types/Database"
import PaginatedResult from "types/PaginatedResult"
import PromiseResult from "types/PromiseResult"
import UserFullDetails from "types/UserFullDetails"

const getAllUsers = async (
  connection: Database,
  visibleForces: string,
  page = 0
): PromiseResult<PaginatedResult<Pick<UserFullDetails, "username" | "forenames" | "surname" | "emailAddress">[]>> => {
  let users = []
  if (visibleForces !== "") {
    const forces = visibleForces.split(",")
    /* eslint-disable @typescript-eslint/naming-convention */
    const forceWhere = forces.map((_, i) => `visible_forces like '%${i}%'`).join(" OR ")
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

    try {
      users = await connection.any(getAllUsersQuery, forces)
    } catch (error) {
      return error as Error
    }
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
