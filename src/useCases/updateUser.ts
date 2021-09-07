import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import User from "types/User"

const updateUser = async (
  connection: Database,
  auditLogger: AuditLogger,
  userDetails: Partial<User>
): PromiseResult<void | Error> => {
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

    await auditLogger("Edit user", { user: userDetails })

    return undefined
  } catch (error) {
    return error
  }
}

export default updateUser
