import User from "types/User"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default async (db: Database, username: string): PromiseResult<Partial<User> | null> => {
  let user

  /* eslint-disable no-useless-escape */
  const getUserQuery = `
      SELECT
        id,
        username,
        email,
        exclusion_list,
        inclusion_list,
        endorsed_by,
        org_serves,
        forenames,
        surname,
        ug.group_id
      FROM br7own.users AS u
        INNER JOIN br7own.users_groups AS ug ON u.id = ug.user_id
      WHERE username = $\{username\} AND deleted_at IS NULL
    `
  /* eslint-disable no-useless-escape */

  try {
    user = await db.oneOrNone<User>(getUserQuery, { username }).catch((error) => error)

    if (user === null) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      emailAddress: user.email,
      exclusionList: user.exclusion_list,
      inclusionList: user.inclusion_list,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      forenames: user.forenames,
      surname: user.surname,
      groupId: user.group_id
    }
  } catch (error) {
    return error
  }
}
