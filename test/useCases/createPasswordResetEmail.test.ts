import { isError } from "types/Result"
import User from "types/User"
import createPasswordResetEmail from "useCases/createPasswordResetEmail"
import { generatePasswordResetToken } from "lib/token/passwordResetToken"
import EmailContent from "types/EmailContent"

jest.mock("lib/token/passwordResetToken")

it("should generate the email subject and body", () => {
  const mockedGeneratePasswordResetToken = generatePasswordResetToken as jest.MockedFunction<
    typeof generatePasswordResetToken
  >
  mockedGeneratePasswordResetToken.mockReturnValue("DUMMY_TOKEN")

  const user = {
    username: "Dummy username",
    emailAddress: "dummy@example.com",
    forenames: "Dummy forenames",
    surname: "Dummy surname"
  } as unknown as User

  const result = createPasswordResetEmail(user, "123456")

  expect(isError(result)).toBe(false)

  const email = result as EmailContent
  expect(email.subject).toMatchSnapshot()
  expect(email.text).toMatchSnapshot()
  expect(email.html).toMatchSnapshot()
})
