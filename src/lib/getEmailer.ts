import nodemailer from "nodemailer"
import config from "lib/config"
import Email from "types/Email"
import Emailer from "types/Emailer"

const getSmtpMailer = (): Emailer =>
  nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.tls,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password
    }
  })

const getConsoleMailer = (): Emailer => ({
  /* eslint-disable no-console */
  // eslint-disable-next-line require-await
  sendMail: async (email: Email) => {
    console.log(`From:    ${email.from}`)
    console.log(`To:      ${email.to}`)
    console.log(`Subject: ${email.subject}`)
    console.log(`\n${email.text}`)
  }
})

let emailer: Emailer

export default function getEmailer(): Emailer {
  if (emailer) {
    return emailer
  }

  emailer = config.smtp.host === "console" ? getConsoleMailer() : getSmtpMailer()
  return emailer
}