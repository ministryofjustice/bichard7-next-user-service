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
  console.log(validated, "validate")
  if (!validated) {
    return new Error("Error: Invalid verification code")
  }
  // set verification code to
  let result = await resetUserVerificationCode(connection, emailAddress)
  console.log(result, "reset user ver")

  // set the new password
  result = await updateUserPassword(connection, emailAddress, password)
  console.log(result, "update user pass")
  return result
}

export default initialiseUserPassword
