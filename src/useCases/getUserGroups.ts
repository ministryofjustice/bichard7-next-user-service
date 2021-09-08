import Database from "types/Database"
import { UserGroupResult } from "types/UserGroup"
import PromiseResult from "types/PromiseResult"

const getUserGroups = async (connection: Database): PromiseResult<UserGroupResult[] | Error> => {
  let groups

  const getUserGroupsQuery = `
      SELECT
        id,
        name
      FROM br7own.groups
      ORDER BY name
    `

  try {
    groups = await connection.any(getUserGroupsQuery)
  } catch (error) {
    return error
  }

  return groups
}

export default getUserGroups
