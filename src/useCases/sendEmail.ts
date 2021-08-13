import { PromiseResult } from "types/Result"

export default (emailAddress: string, subject: string, body: string): PromiseResult<void> => {
  console.log("Recipient: ", emailAddress)
  console.log("Subject: ", subject)
  console.log("Body:")
  console.log(body)

  return Promise.resolve()
}
