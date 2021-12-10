import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import User from "types/User"
import { ITask } from "pg-promise"
import { isError } from "types/Result"
import { UserGroupResult } from "types/UserGroup"

const deleteFromUsersGroups = (task: ITask<unknown>, userId: number, newGroupIds: number[]): PromiseResult<null> => {
  if (newGroupIds.length === 0) {
    const deleteAllFromUsersGroupsQuery = `
      DELETE FROM br7own.users_groups
      WHERE user_id = $\{userId\}
    `

    return task.none(deleteAllFromUsersGroupsQuery, { userId }).catch((error) => error as Error)
  }

  const deleteFromUsersGroupsQuery = `
    DELETE FROM br7own.users_groups
    WHERE user_id = $\{userId\} AND group_id NOT IN ($\{newGroupIds:csv\})
  `

  return task.none(deleteFromUsersGroupsQuery, { userId, newGroupIds }).catch((error) => error as Error)
}

const updateUsersGroup = (
  task: ITask<unknown>,
  userId: number,
  currentUserId: number,
  groupIds: number[]
): PromiseResult<null> => {
  const insertGroupQuery = `
    INSERT INTO br7own.users_groups(
      user_id,
      group_id
    )
    SELECT 
      $\{targetUserId\} AS user_id,
      group_id 
    FROM br7own.users_groups AS ug
    WHERE
      ug.user_id = $\{currentUserId\} AND
      ug.group_id IN ($\{groupIds:csv\}) AND
      ug.group_id NOT IN (SELECT group_id FROM br7own.users_groups as ug2 WHERE ug2.user_id = $\{targetUserId\});
  `
  return task.none(insertGroupQuery, { targetUserId: userId, currentUserId, groupIds })
}

const updateUserTable = async (task: ITask<unknown>, userDetails: Partial<User>): PromiseResult<void> => {
  const updateUserQuery = `
    UPDATE br7own.users
	    SET
        forenames=$\{forenames\},
        surname=$\{surname\},
        email=$\{emailAddress\},
        org_serves=$\{orgServes\},
        visible_courts=$\{visibleCourts\},
        visible_forces=$\{visibleForces\},
        excluded_triggers=$\{excludedTriggers\}
	    WHERE id = $\{id\}
    `

  const result = await task.result(updateUserQuery, { ...userDetails })

  if (isError(result) || result.rowCount === 0) {
    console.error(result)
    return Error("Could not update user")
  }

  return undefined
}

const updateUser = async (
  connection: Database,
  auditLogger: AuditLogger,
  currentUserId: number,
  userDetails: Partial<User>
): PromiseResult<void | Error> => {
  const result = await connection.tx(async (task: ITask<unknown>): PromiseResult<void> => {
    const selectedGroups: number[] = userDetails.groups
      ? userDetails.groups.map((group: UserGroupResult) => parseInt(group.id, 10))
      : []
    const userId = userDetails.id as number
    const updateUserResult = await updateUserTable(task, userDetails)

    if (isError(updateUserResult)) {
      return Error("Could not update user")
    }
    const deleteUserGroupsResult = await deleteFromUsersGroups(task, userId, selectedGroups)

    if (isError(deleteUserGroupsResult)) {
      console.error(deleteUserGroupsResult)
      return Error("Could not delete groups")
    }

    if (selectedGroups.length !== 0) {
      const updateUserGroupsResult = await updateUsersGroup(task, userId, currentUserId, selectedGroups)

      if (isError(updateUserGroupsResult)) {
        console.error(updateUserGroupsResult)
        return Error("Could not insert groups")
      }
    }

    return undefined
  })

  if (isError(result)) {
    console.error(result)
    return new Error("There was an error while updating the user. Please try again.")
  }

  await auditLogger("Edit user", { user: userDetails })

  return undefined
}

export default updateUser
