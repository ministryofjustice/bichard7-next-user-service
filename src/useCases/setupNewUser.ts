import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import UserCreateDetails from "types/UserDetails"
import createNewUserEmail from "./createNewUserEmail"
import createUser from "./createUser"
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

  const email = createNewUserEmailResult
  const emailer = getEmailer()

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: userCreateDetails.emailAddress,
      ...email
    })
    .catch((error: Error) => error)
}
