import { isError } from "types/Result"
import EmailContent from "types/EmailContent"
import { generateEmailVerificationToken } from "lib/token/emailVerificationToken"
import createVerificationEmail from "useCases/createVerificationEmail"

jest.mock("lib/token/emailVerificationToken")

it("should generate the email subject and body", () => {
  const mockedGenerateEmailVerificationToken = generateEmailVerificationToken as jest.MockedFunction<
    typeof generateEmailVerificationToken
  >
  mockedGenerateEmailVerificationToken.mockReturnValue("DUMMY_TOKEN")

  const result = createVerificationEmail("http://localhost:3000/login/verify?token=DUMMY_TOKEN")

  expect(isError(result)).toBe(false)

  const email = result as EmailContent
  expect(email.subject).toMatchSnapshot()
  expect(email.text).toMatchSnapshot()
  expect(email.html).toMatchSnapshot()
})
