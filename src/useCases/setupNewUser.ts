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
import logger from "utils/logger"
import createNewUserEmail from "./createNewUserEmail"
import createUser from "./createUser"

export interface newUserSetupResult {
  successMessage: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async (
  connection: Database,
  auditLogger: AuditLogger,
  currentUser: Partial<User>,
  userCreateDetails: any,
  baseUrl: string
): PromiseResult<newUserSetupResult> => {
  const result = await createUser(connection, currentUser, userCreateDetails)

  if (isError(result)) {
    return result
  }

  await auditLogger("Create user", { user: userCreateDetails, by: currentUser })

  const createNewUserEmailResult = createNewUserEmail(userCreateDetails, baseUrl)

  if (isError(createNewUserEmailResult)) {
    await auditLogger("Error creating new user email", { user: userCreateDetails })
    logger.error(createNewUserEmailResult)
    return Error("Server error. Please try again later.")
  }

  const email = createNewUserEmailResult
  const emailer = getEmailer(userCreateDetails.emailAddress)

  const groupsForCurrentUser = await getUserGroups(connection, currentUser.username ?? "")

  if (isError(groupsForCurrentUser)) {
    logger.error(groupsForCurrentUser)
    return groupsForCurrentUser
  }
  const groupsForNewUser = groupsForCurrentUser.filter((group: any) => userCreateDetails[group.name] === "yes")

  emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix("matt.knight@justice.gov.uk"),
      ...UserCreatedNotification({ user: { ...userCreateDetails, ...{ groups: groupsForNewUser } } })
    })
    .then(() => logger.info(`Email successfully sent to ${userCreateDetails.emailAddress}`))
    .catch(async () => {
      await auditLogger("Error sending notification email of new user creation", { user: userCreateDetails })
    })

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(userCreateDetails.emailAddress),
      ...email
    })
    .then(() => logger.info(`Email successfully sent to ${userCreateDetails.emailAddress}`))
    .catch(async (error: Error) => {
      await auditLogger("Error sending email to new user", { user: userCreateDetails })
      return error
    })
}
/* eslint-disable @typescript-eslint/no-explicit-any */
