import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import createNewUserEmail from "./createNewUserEmail"
import createUser from "./createUser"
import storePasswordResetCode from "./storePasswordResetCode"

export interface newUserSetupResult {
  successMessage: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async (
  connection: Database,
  auditLogger: AuditLogger,
  userCreateDetails: any
): PromiseResult<newUserSetupResult> => {
  const result = await createUser(connection, userCreateDetails)

  if (isError(result)) {
    return result
  }

  await auditLogger("Create user", { user: userCreateDetails })

  const passwordSetCode = randomDigits(config.verificationCodeLength).join("")
  const passwordSetCodeResult = await storePasswordResetCode(
    connection,
    userCreateDetails.emailAddress as string,
    passwordSetCode
  )

  if (isError(passwordSetCodeResult)) {
    return passwordSetCodeResult
  }

  const createNewUserEmailResult = createNewUserEmail(userCreateDetails, passwordSetCode)

  if (isError(createNewUserEmailResult)) {
    console.error(createNewUserEmailResult)
    return Error("Server error. Please try again later.")
  }

  const email = createNewUserEmailResult
  const emailer = getEmailer()

  const emailerResult = await emailer
    .sendMail({
      from: config.emailFrom,
      to: userCreateDetails.emailAddress as string,
      ...email
    })
    .catch((error: Error) => error)

  if (isError(emailerResult)) {
    console.error(emailerResult)
    return Error("Server error. Please try again later.")
  }

  return emailerResult
}
/* eslint-disable @typescript-eslint/no-explicit-any */
