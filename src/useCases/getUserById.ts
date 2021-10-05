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
        ug.group_id
      FROM br7own.users AS u
	    INNER JOIN br7own.users_groups AS ug ON u.id = ug.user_id
      WHERE id = $\{id\} AND deleted_at IS NULL
    `

  try {
    user = await connection.one(getUserByIdQuery, { id })
  } catch (error) {
    return error
  }

  return {
    id: user.id,
    username: user.username,
    forenames: user.forenames,
    surname: user.surname,
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    emailAddress: user.email,
    groupId: user.group_id
  }
}

export default getUserById
