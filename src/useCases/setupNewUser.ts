import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import UserCreateDetails from "types/UserCreateDetails"
import createUser from "./createUser"
import createNewUserEmail from "./createNewUserEmail"
import sendEmail from "./sendEmail"
import storePasswordResetCode from "./storePasswordResetCode"

export interface newUserSetupResult {
  errorMessage: string
  successMessage: string
}

export default async (
  connection: Database,
  userCreateDetails: UserCreateDetails
): PromiseResult<newUserSetupResult> => {
  let errorMessage = ""
  let successMessage = ""
  const result = await createUser(connection, userCreateDetails)
  errorMessage = result.error.message
  if (errorMessage === "") {
    successMessage = `User ${userCreateDetails.username} has been successfully created`
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
  }
  return { errorMessage, successMessage }
}
