import UserCreatedNotification from "emails/UserCreatedNotification"
import { addCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import AuditLogger from "types/AuditLogger"
import Database from "types/Database"
import AuditLogEvent from "types/AuditLogEvent"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import User from "types/User"
import logger from "utils/logger"
import createNewUserEmail from "./createNewUserEmail"
import createUser from "./createUser"
import getUserHierarchyGroups from "./getUserHierarchyGroups"

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

  await auditLogger(AuditLogEvent.createdUser, { user: userCreateDetails, by: currentUser })

  const createNewUserEmailResult = createNewUserEmail(userCreateDetails, baseUrl)

  if (isError(createNewUserEmailResult)) {
    await auditLogger(AuditLogEvent.failedCreatingNewEmailWhileCreatingUser, { user: userCreateDetails })
    logger.error(createNewUserEmailResult)
    return Error("Server error. Please try again later.")
  }

  const email = createNewUserEmailResult
  const emailer = getEmailer(userCreateDetails.emailAddress)

  const groupsForCurrentUser = await getUserHierarchyGroups(connection, currentUser.username ?? "")

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
      await auditLogger(AuditLogEvent.failedNotificationWhileCreatingUser, { user: userCreateDetails })
    })

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(userCreateDetails.emailAddress),
      ...email
    })
    .then(() => logger.info(`Email successfully sent to ${userCreateDetails.emailAddress}`))
    .catch(async (error: Error) => {
      await auditLogger(AuditLogEvent.failedToEmailUserWhileCreatingUser, { user: userCreateDetails })
      return error
    })
}
/* eslint-disable @typescript-eslint/no-explicit-any */
