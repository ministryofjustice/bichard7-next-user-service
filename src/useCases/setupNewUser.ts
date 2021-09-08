import { randomDigits } from "crypto-secure-random-digit"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"
import User from "types/User"
import createNewUserEmail from "./createNewUserEmail"
import createUser from "./createUser"
import storePasswordResetCode from "./storePasswordResetCode"

export interface newUserSetupResult {
  successMessage: string
}

export default async (
  connection: Database,
  auditLogger: AuditLogger,
  userCreateDetails: Partial<User>
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

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const createNewUserEmailResult = createNewUserEmail(userCreateDetails as any, passwordSetCode)
  if (isError(createNewUserEmailResult)) {
    return createNewUserEmailResult
  }

  const email = createNewUserEmailResult
  const emailer = getEmailer()

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: userCreateDetails.emailAddress as string,
      ...email
    })
    .catch((error: Error) => error)
}
