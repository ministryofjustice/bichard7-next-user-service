import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import UserCreateDetails from "types/UserDetails"
import createUser from "./createUser"
import createNewUserEmail from "./createNewUserEmail"
import sendEmail from "./sendEmail"
import storePasswordResetCode from "./storePasswordResetCode"

export interface newUserSetupResult {
  successMessage: string
}

export default async (
  connection: Database,
  userCreateDetails: UserCreateDetails
): PromiseResult<newUserSetupResult> => {
  const result = await createUser(connection, userCreateDetails)
  if (isError(result)) {
    return result
  }
  const successMessage = `User ${userCreateDetails.username} has been successfully created`
  const passwordSetCode = randomDigits(config.verificationCodeLength).join("")
  const passwordSetCodeResult = await storePasswordResetCode(
    connection,
    userCreateDetails.emailAddress,
    passwordSetCode
  )
  if (isError(passwordSetCodeResult)) {
    return passwordSetCodeResult
  }

  const createNewUserEmailResult = createNewUserEmail(userCreateDetails, passwordSetCode)
  if (isError(createNewUserEmailResult)) {
    return createNewUserEmailResult
  }
  const { subject, body } = createNewUserEmailResult
  await sendEmail(userCreateDetails.emailAddress, subject, body)

  return { successMessage }
}
