import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import User from "types/User"
import { ITask } from "pg-promise"

const deleteFromUsersGroups = async (task: ITask<unknown>, userId: number) => {
  /* eslint-disable no-useless-escape */
  const deleteFromUsersGroupsQuery = `
    DELETE FROM br7own.users_groups
    WHERE user_id = $\{userId\}
  `
  /* eslint-disable no-useless-escape */
  await task.none(deleteFromUsersGroupsQuery, { userId })
}

const updateUsersGroup = async (task: ITask<unknown>, userId: number, groupId: number) => {
  /* eslint-disable no-useless-escape */
  const updateUsersGroupQuery = `
    INSERT INTO br7own.users_groups
      (
        user_id,
        group_id
      ) VALUES (
        $\{userId\},
        $\{groupId\}
      )
  `
  /* eslint-disable no-useless-escape */
  await task.none(updateUsersGroupQuery, { userId, groupId })
}
/* eslint-disable @typescript-eslint/return-await */
const updateUserTable = async (task: ITask<unknown>, userDetails: Partial<User>) => {
  /* eslint-disable no-useless-escape */
  const updateUserQuery = `
    UPDATE br7own.users
	    SET 
        username=$\{username\},
        forenames=$\{forenames\},
        surname=$\{surname\},
        endorsed_by=$\{endorsedBy\},
        org_serves=$\{orgServes\}
	    WHERE id = $\{id\}
    `
  /* eslint-disable no-useless-escape */

  return await task.result(updateUserQuery, { ...userDetails })
}
/* eslint-disable @typescript-eslint/return-await */

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const notUpdated = (row: any) => row && row.rowCount === 0

const updateUser = async (
  connection: Database,
  auditLogger: AuditLogger,
  userDetails: Partial<User>
): PromiseResult<void | Error> => {
  const groupDoesNotExistsError = new Error("This group does not exist")
  try {
    const result = await connection.tx(async (task: ITask<unknown>) => {
      await deleteFromUsersGroups(task, userDetails.id as number)
      const r = await updateUserTable(task, userDetails)

      if (notUpdated(r)) {
        return r
      }
      await updateUsersGroup(task, userDetails.id as number, userDetails.groupId as number)
      return r
    })

    if (notUpdated(result)) {
      return new Error("Error updating user")
    }

    await auditLogger("Edit user", { user: userDetails })

    return undefined
  } catch (error) {
    if (
      error.message ===
      'insert or update on table "users_groups" violates foreign key constraint "users_groups_group_id_fkey"'
    ) {
      return groupDoesNotExistsError
    }
    return error
  }
}

export default updateUser
