import Email from "types/Email"

/* eslint-disable no-console */
// eslint-disable-next-line require-await
export default async (email: Email) => {
  console.log("From: ", email.from)
  console.log("To: ", email.to)
  console.log("Subject: ", email.subject)
  console.log("Body:")
  console.log(email.text)
}
