import User from "types/User"
import PromiseResult from "types/PromiseResult"
import Database from "types/Database"
import { ITask } from "pg-promise"
import { isError } from "types/Result"
import isUsernameUnique from "./isUsernameUnique"
import isEmailUnique from "./IsEmailUnique"

type UserId = {
  id: number
}

/* eslint-disable require-await */
const insertUser = async (task: ITask<unknown>, userDetails: Partial<User>): Promise<UserId> => {
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

  return task.one(insertUserQuery, { ...userDetails })
}

const insertUserIntoGroup = async (task: ITask<unknown>, userId: number, groupId: number) => {
  const insertGroupQuery = `
    INSERT INTO br7own.users_groups(
      user_id,
      group_id
    ) VALUES (
      $\{userId\},
      $\{groupId\}
    );
  `

  await task.none(insertGroupQuery, { userId, groupId })
}

export default async (connection: Database, userDetails: Partial<User>): PromiseResult<void> => {
  const groupDoesNotExistsError = new Error("This group does not exist")
  const isUsernameUniqueResult = await isUsernameUnique(connection, userDetails.username as string)
  if (isError(isUsernameUniqueResult)) {
    return isUsernameUniqueResult
  }

  const isEmailUniqueResult = await isEmailUnique(connection, userDetails.emailAddress as string)
  if (isError(isEmailUniqueResult)) {
    return isEmailUniqueResult
  }

  try {
    await connection.tx(async (task: ITask<unknown>) => {
      const { id } = await insertUser(task, userDetails)
      if (userDetails.groupId) {
        await insertUserIntoGroup(task, id, userDetails.groupId)
      }
    })

    return undefined
  } catch (e) {
    if (
      e.message ===
      'insert or update on table "users_groups" violates foreign key constraint "users_groups_group_id_fkey"'
    ) {
      return groupDoesNotExistsError
    }
    return e
  }
}
