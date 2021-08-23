import Email from "./Email"

export default interface Emailer {
  sendMail: (email: Email) => any
}
