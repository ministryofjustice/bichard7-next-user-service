import User from "types/User"
import PromiseResult from "types/PromiseResult"
import Database from "types/Database"
import { ITask } from "pg-promise"
import isUsernameUnique from "./isUsernameUnique"
import isEmailUnique from "./IsEmailUnique"

type UserId = {
  id: string
}

/* eslint-disable require-await */
const insertUser = async (task: ITask<unknown>, userDetails: Partial<User>): Promise<UserId> => {
  /* eslint-disable no-useless-escape */
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
  /* eslint-disable no-useless-escape */

  return task.one(insertUserQuery, { ...userDetails })
}
/* eslint-disable require-await */

const insertUserIntoGroup = async (task: ITask<unknown>, userId: number, groupId: number) => {
  /* eslint-disable no-useless-escape */
  const insertGroupQuery = `
    INSERT INTO br7own.users_groups(
      user_id, 
      group_id
    ) VALUES (
      $\{userId\}, 
      $\{groupId\}
    );
  `
  /* eslint-disable no-useless-escape */

  await task.none(insertGroupQuery, { userId, groupId })
}

export default async (connection: Database, userDetails: Partial<User>): PromiseResult<void> => {
  const groupDoesNotExistsError = new Error("This group does not exist")
  let checkData = await isUsernameUnique(connection, userDetails.username as string)
  if (checkData.message !== "") {
    return new Error(checkData.message)
  }

  checkData = await isEmailUnique(connection, userDetails.emailAddress as string)
  if (checkData.message !== "") {
    return new Error(checkData.message)
  }

  try {
    await connection.tx(async (task: ITask<unknown>) => {
      const { id } = await insertUser(task, userDetails)
      await insertUserIntoGroup(task, parseInt(id, 10), userDetails.groupId as number)
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
