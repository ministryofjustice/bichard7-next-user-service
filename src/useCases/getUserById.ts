import Database from "types/Database"
import User from "types/User"
import PromiseResult from "types/PromiseResult"

const getUserById = async (connection: Database, id: number): PromiseResult<Partial<User>> => {
  let user

  const getUserByIdQuery = `
      SELECT
        id,
        username ,
        forenames,
        surname,
        endorsed_by,
        org_serves,
        email,
        (SELECT group_id FROM br7own.users_groups as ug WHERE ug.user_id = u.id LIMIT 1) as group_id,
        visible_courts,
        visible_forces,
        excluded_triggers
      FROM br7own.users AS u
      WHERE id = $\{id\} AND deleted_at IS NULL
    `

  try {
    user = await connection.one(getUserByIdQuery, { id })
  } catch (error) {
    return error as Error
  }

  return {
    id: user.id,
    username: user.username,
    forenames: user.forenames,
    surname: user.surname,
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    emailAddress: user.email,
    groupId: user.group_id,
    visibleCourts: user.visible_courts,
    visibleForces: user.visible_forces,
    excludedTriggers: user.excluded_triggers
  }
}

export default getUserById
