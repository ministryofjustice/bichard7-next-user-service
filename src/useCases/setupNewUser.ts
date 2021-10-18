import { randomDigits } from "crypto-secure-random-digit"
import cjsmify from "lib/cjsmify"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
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
  currentUserId: number,
  userCreateDetails: any
): PromiseResult<newUserSetupResult> => {
  const result = await createUser(connection, currentUserId, userCreateDetails)

  if (isError(result)) {
    return result
  }

  await auditLogger("Create user", { user: userCreateDetails })

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
    console.error(createNewUserEmailResult)
    return Error("Server error. Please try again later.")
  }

  const email = createNewUserEmailResult
  const emailer = getEmailer()

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: cjsmify(userCreateDetails.emailAddress),
      ...email
    })
    .catch((error: Error) => error)
}
/* eslint-disable @typescript-eslint/no-explicit-any */
