import Database from "types/Database"
import { UserGroupResult } from "types/UserGroup"
import PromiseResult from "types/PromiseResult"

const getUserGroups = (connection: Database, usernames: string[]): PromiseResult<UserGroupResult[]> => {
  const getUserGroupsQuery = `
    WITH RECURSIVE name_tree AS ( 
      SELECT DISTINCT
        g.id,
        g.name,
        g.friendly_name,
        g.parent_id
      FROM br7own.groups AS g
        INNER JOIN br7own.users_groups AS ug ON ug.group_id = g.id
        INNER JOIN br7own.users AS u ON u.id = ug.user_id
      WHERE u.username IN ($\{usernames:csv\})
      UNION ALL
        SELECT DISTINCT
          g2.id,
          g2.name,
          g2.friendly_name,
          g2.parent_id
        FROM br7own.groups AS g2
          JOIN name_tree p ON p.id = g2.parent_id
    )
    SELECT DISTINCT
      id,
      name,
      friendly_name,
      parent_id
    FROM name_tree
    OPTION (MAXRECURSION 8)
  `

  return connection.any(getUserGroupsQuery, { usernames }).catch((error) => error as Error)
}

export default getUserGroups
