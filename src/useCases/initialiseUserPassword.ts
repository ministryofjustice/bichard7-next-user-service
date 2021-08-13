import Database from "types/Database"
import resetUserVerificationCode from "./resetUserVerificationCode"
import updateUserPassword from "./updateUserPassword"
import validateUserVerificationCode from "./validateUserVerificationCode"

const initialiseUserPassword = async (
  connection: Database,
  emailAddress: string,
  verificationCode: string,
  password: string
) => {
  // check if we have the correct user
  const validated = await validateUserVerificationCode(connection, emailAddress, verificationCode)
  console.log(validated)
  if (!validated) {
    return new Error("Error: Invalid verification code")
  }
  // set verification code to
  resetUserVerificationCode(connection, emailAddress)

  // set the new password
  const result = await updateUserPassword(connection, emailAddress, password)
  console.log(result)
  return result
}

export default initialiseUserPassword
