import Database from "types/Database"
import User from "types/User"

const getUser = async (connection: Database, username: string): Promise<Partial<User>> => {
  let user

  const getUserQuery = `
      SELECT
        id,
        username,
        forenames,
        surname,
        phone_number,
        postal_address,
        post_code,
        endorsed_by,
        org_serves,
        email
      FROM br7own.users
      WHERE username = $1
    `
  try {
    user = await connection.one(getUserQuery, [username])
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

export default getUser
