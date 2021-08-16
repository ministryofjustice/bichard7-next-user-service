import Database from "types/Database"
import User from "types/User"

const updateUser = async (connection: Database, userDetails: Partial<User>): Promise<Partial<User>> => {
  const updateUserQuery = `
    UPDATE br7own.users
	    SET 
        username=$2, 
        forenames=$3, 
        surname=$4, 
        phone_number=$5, 
        post_code=$6, 
        postal_address=$7, 
        endorsed_by=$8,
        org_serves=$9,
        email=$10
	    WHERE id = $1
    `

  const getUserQuery = `
    SELECT
      id,
      username, 
      forenames, 
      surname, 
      phone_number, 
      post_code, 
      postal_address, 
      endorsed_by,
      org_serves,
      email
      FROM br7own.users
    WHERE id = $1
  `

  try {
    await connection.none(updateUserQuery, [
      userDetails.id,
      userDetails.username,
      userDetails.forenames,
      userDetails.surname,
      userDetails.phoneNumber,
      userDetails.postCode,
      userDetails.postalAddress,
      userDetails.endorsedBy,
      userDetails.orgServes,
      userDetails.emailAddress
    ])

    const user = await connection.one(getUserQuery, [userDetails.id])

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
  } catch (error) {
    return error
  }
}

export default updateUser
