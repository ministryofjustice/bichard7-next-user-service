import { randomDigits } from "crypto-secure-random-digit"
import UserCreatedNotification from "emails/UserCreatedNotification"
import { addCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import User from "types/User"
import { getUserGroups } from "useCases"
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
  currentUser: Partial<User>,
  userCreateDetails: any
): PromiseResult<newUserSetupResult> => {
  const result = await createUser(connection, currentUser, userCreateDetails)

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
    await auditLogger("Error creating new user email", { user: userCreateDetails })
    console.error(createNewUserEmailResult)
    return Error("Server error. Please try again later.")
  }

  const email = createNewUserEmailResult
  const emailer = getEmailer(userCreateDetails.emailAddress)

  const groupsForCurrentUser = await getUserGroups(connection, [currentUser.username, userCreateDetails.username])

  if (isError(groupsForCurrentUser)) {
    console.error(groupsForCurrentUser)
    return groupsForCurrentUser
  }
  const groupsForNewUser = groupsForCurrentUser.filter((group: any) => userCreateDetails[group.name] === "yes")
  if (isError(result)) {
    return result
  }

  emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix("matt.knight@justice.gov.uk"),
      ...UserCreatedNotification({ user: { ...userCreateDetails, ...{ groups: groupsForNewUser } } })
    })
    .catch(async () => {
      await auditLogger("Error sending notification email of new user creation", { user: userCreateDetails })
    })

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(userCreateDetails.emailAddress),
      ...email
    })
    .catch(async (error: Error) => {
      await auditLogger("Error sending email to new user", { user: userCreateDetails })
      return error
    })
}
/* eslint-disable @typescript-eslint/no-explicit-any */
