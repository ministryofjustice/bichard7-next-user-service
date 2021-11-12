import PromiseResult from "types/PromiseResult"
import Database from "types/Database"
import { ITask } from "pg-promise"
import { isError } from "types/Result"
import User from "types/User"
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
        endorsed_by,
        org_serves,
        visible_courts,
        visible_forces,
        excluded_triggers
      )
      VALUES (
        $\{username\},
        $\{forenames\},
        $\{surname\},
        $\{emailAddress\},
        $\{endorsedBy\},
        $\{orgServes\},
        $\{visibleCourts\},
        $\{visibleForces\},
        $\{excludedTriggers\}
      ) RETURNING id;
    `

  return task.one(insertUserQuery, { ...userDetails }).catch((error) => error)
}

const insertUserIntoGroup = async (
  task: ITask<unknown>,
  newUserId: number,
  currentUserId: number,
  groupIds: number[]
): PromiseResult<void> => {
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

      if (userDetails.groupId) {
        const userGroupResult = await insertUserIntoGroup(task, insertUserResult.id, currentUserId, [
          userDetails.groupId
        ])
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
