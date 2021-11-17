import User from "types/User"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import getUserGroups from "useCases/getUserGroups"
import { isError } from "types/Result"

export default async (connection: Database, username: string): PromiseResult<User | null> => {
  let user
  const getUserQuery = `
      SELECT
        id,
        username,
        email,
        endorsed_by,
        org_serves,
        forenames,
        surname,
        visible_courts,
        visible_forces,
        excluded_triggers
      FROM br7own.users AS u
      WHERE username = $\{username\} AND deleted_at IS NULL
    `

  try {
    user = await connection.oneOrNone<User>(getUserQuery, { username }).catch((error) => error)

    if (user === null) {
      return null
    }
  } catch (error) {
    return error as Error
  }

  const groups = await getUserGroups(connection, [user.username])
  if (isError(groups)) {
    return groups
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
    groups,
    visibleCourts: user.visible_courts,
    visibleForces: user.visible_forces,
    excludedTriggers: user.excluded_triggers
  }
}
