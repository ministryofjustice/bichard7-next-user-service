import Database from "types/Database"
import { UserGroupResult } from "types/UserGroup"
import PromiseResult from "types/PromiseResult"

const getUserGroups = (connection: Database, usernames: string[]): PromiseResult<UserGroupResult[]> => {
  const getUserGroupsQuery = `
      SELECT DISTINCT
        g.id,
        g.name
      FROM br7own.groups AS g
      INNER JOIN br7own.users_groups AS ug ON ug.group_id = g.id
      INNER JOIN br7own.users AS u ON u.id = ug.user_id
      WHERE u.username IN ($\{usernames:csv\})
      ORDER BY g.name
    `

  return connection.any(getUserGroupsQuery, { usernames }).catch((error) => error as Error)
}

export default getUserGroups
