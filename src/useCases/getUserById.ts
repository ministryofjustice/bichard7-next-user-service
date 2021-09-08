import Database from "types/Database"
import User from "types/User"
import PromiseResult from "types/PromiseResult"

const getUserById = async (connection: Database, id: number): PromiseResult<Partial<User>> => {
  let user

  /* eslint-disable no-useless-escape */
  const getUserByIdQuery = `
      SELECT
        id,
        username ,
        forenames,
        surname,
        phone_number,
        postal_address,
        post_code,
        endorsed_by,
        org_serves,
        email,
        ug.group_id
      FROM br7own.users AS u
	    INNER JOIN br7own.users_groups AS ug ON u.id = ug.user_id
      WHERE id = $\{id\} AND deleted_at IS NULL
    `
  /* eslint-disable no-useless-escape */

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
    phoneNumber: user.phone_number,
    postCode: user.post_code,
    postalAddress: user.postal_address,
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    emailAddress: user.email,
    groupId: user.group_id
  }
}

export default getUserById
