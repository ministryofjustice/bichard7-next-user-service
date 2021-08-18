import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import UserCreateDetails from "types/UserDetails"
import createNewUserEmail from "./createNewUserEmail"
import sendEmail from "./sendEmail"
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

  return await sendEmail({
    from: "Bichard <bichard@cjse.org>",
    to: userCreateDetails.emailAddress,
    ...email
  })
}
