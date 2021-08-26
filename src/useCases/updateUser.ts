import Database from "types/Database"
import User from "types/User"

const updateUser = async (connection: Database, userDetails: Partial<User>): Promise<boolean | Error> => {
  /* eslint-disable no-useless-escape */
  const updateUserQuery = `
    UPDATE br7own.users
	    SET 
        username=$\{username\}, 
        forenames=$\{forenames\}, 
        surname=$\{surname\}, 
        phone_number=$\{phoneNumber\}, 
        post_code=$\{postCode\}, 
        postal_address=$\{postalAddress\}, 
        endorsed_by=$\{endorsedBy\},
        org_serves=$\{orgServes\}
	    WHERE id = $\{id\}
    `
  /* eslint-disable no-useless-escape */

  try {
    const rowsUpdated = await connection.result(updateUserQuery, {
      ...userDetails
    })

    if (rowsUpdated.rowCount === 0) {
      return Error("Error updating user")
    }

    return true
  } catch (error) {
    return error
  }
}

export default updateUser
