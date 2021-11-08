import PromiseResult from "types/PromiseResult"
import Database from "types/Database"
import { ITask } from "pg-promise"
import { isError } from "types/Result"
import User from "types/User"
import { UserGroupResult } from "types/UserGroup"
import isUsernameUnique from "./isUsernameUnique"
import isEmailUnique from "./IsEmailUnique"

type InsertUserResult = PromiseResult<{ id: number }>

const insertUser = (task: ITask<unknown>, userDetails: Partial<User>): InsertUserResult => {
  const insertUserQuery = `
      INSERT INTO br7own.users(
        username,
        forenames,
        surname,
        email,
        exclusion_list,
        inclusion_list,
        endorsed_by,
        org_serves
      )
      VALUES (
        $\{username\},
        $\{forenames\},
        $\{surname\},
        $\{emailAddress\},
        '',
        '',
        $\{endorsedBy\},
        $\{orgServes\}
      ) RETURNING id;
    `

  return task.one(insertUserQuery, { ...userDetails }).catch((error) => error)
}

const insertUserIntoGroup = async (
  task: ITask<unknown>,
  newUserId: number,
  currentUserId: number,
  groups: UserGroupResult[]
): PromiseResult<void> => {
  const groupIds = groups.map((group: UserGroupResult) => group.id)

  const insertGroupQuery = `
    INSERT INTO br7own.users_groups(
      user_id,
      group_id
    )
    SELECT 
      $\{newUserId\} AS user_id,
      group_id 
    FROM br7own.users_groups AS ug
    WHERE
      ug.user_id = $\{currentUserId\} AND
      ug.group_id IN ($\{groupIds:csv\});
  `

  const result = await task
    .result(insertGroupQuery, { newUserId, currentUserId, groupIds })
    .catch((error) => error as Error)

  if (isError(result)) {
    console.error(result)
  }

  return undefined
}

export default async (connection: Database, currentUserId: number, userDetails: Partial<User>): PromiseResult<void> => {
  const isUsernameUniqueResult = await isUsernameUnique(connection, userDetails.username as string)
  if (isError(isUsernameUniqueResult)) {
    return isUsernameUniqueResult
  }

  const isEmailUniqueResult = await isEmailUnique(connection, userDetails.emailAddress as string)
  if (isError(isEmailUniqueResult)) {
    return isEmailUniqueResult
  }

  const createUserResult = await connection
    .tx(async (task: ITask<unknown>) => {
      const insertUserResult = await insertUser(task, userDetails)

      if (isError(insertUserResult)) {
        console.error(insertUserResult)
        return Error("Could not insert record into users table")
      }

      if (userDetails.groups) {
        const userGroupResult = await insertUserIntoGroup(task, insertUserResult.id, currentUserId, userDetails.groups)
        return userGroupResult
      }

      return undefined
    })
    .catch((error) => error)

  if (isError(createUserResult)) {
    console.error(createUserResult)
    return Error("Could not create user")
  }

  return undefined
}
