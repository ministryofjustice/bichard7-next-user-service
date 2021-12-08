import generateEmailChangedEmail from "emails/emailChanged"
import { addCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getEmailer from "lib/getEmailer"
import PromiseResult from "types/PromiseResult"
import User from "types/User"

export default async (
  user: Pick<User, "forenames" | "surname">,
  oldEmail: string,
  newEmail: string
): PromiseResult<void> => {
  const oldEmailContent = generateEmailChangedEmail({ status: "old", user })
  const newEmailContent = generateEmailChangedEmail({ status: "new", user })

  let sendingError: Error | undefined

  await getEmailer(oldEmail)
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(oldEmail),
      ...oldEmailContent
    })
    .then(() => console.log(`Email successfully sent to ${oldEmail}`))
    .catch((error: Error) => {
      console.error(`Error sending email to ${oldEmail}`, error.message)
      sendingError = error
    })

  await getEmailer(newEmail)
    .sendMail({
      from: config.emailFrom,
      to: addCjsmSuffix(newEmail),
      ...newEmailContent
    })
    .then(() => console.log(`Email successfully sent to ${newEmail}`))
    .catch((error: Error) => {
      console.error(`Error sending email to ${newEmail}`, error.message)
      sendingError = error
    })

  return sendingError
}
