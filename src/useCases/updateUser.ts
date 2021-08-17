import Database from "types/Database"
import User from "types/User"

const updateUser = async (connection: Database, userDetails: Partial<User>): Promise<boolean | Error> => {
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

  /* const getUserQuery = `
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
  ` */

  try {
    const rowsUpdated = await connection.result(updateUserQuery, [
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

    if (rowsUpdated.rowCount === 0) {
      return Error("Error updating user")
    }

    return true
  } catch (error) {
    return error
  }
}

export default updateUser
