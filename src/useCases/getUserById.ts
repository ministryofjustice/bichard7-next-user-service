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
        phone_number,
        postal_address,
        post_code,
        endorsed_by,
        org_serves,
        email
      FROM br7own.users
      WHERE id = $1 AND deleted_at IS NULL
    `

  try {
    user = await connection.one(getUserByIdQuery, [id])
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
    emailAddress: user.email
  }
}

export default getUserById
