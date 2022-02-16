import config from "lib/config"
import getEmailer from "lib/getEmailer"
import PromiseResult from "types/PromiseResult"
import logger from "utils/logger"

const postFeedback = (feedback: string, currentUserEmail: string): PromiseResult<void> => {
  const sendFeedbackTo = "kayleigh.derricutt@madetech.cjsm.net" // sorry Kayleigh :(

  const emailer = getEmailer(sendFeedbackTo)
  const emailContent = {
    subject: "New Feedback",
    html: "",
    text: `User ${currentUserEmail} has written the following feedback: '${feedback}'`
  }

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: sendFeedbackTo,
      ...emailContent
    })
    .then(() => logger.info(`Feedback successfully sent`))
    .catch((error: Error) => {
      logger.error(`Error sending email `, error.message)
      return error
    })
}

export default postFeedback
