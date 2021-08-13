import { Result } from "types/Result"

export default (emailAddress: string, subject: string, body: string): Result<void> => {
  console.log("Recipient: ", emailAddress)
  console.log("Subject: ", subject)
  console.log("Body:")
  console.log(body)
}
