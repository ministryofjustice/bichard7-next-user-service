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

  const verificationEmailContent = createVerificationEmail("http://localhost:3000/login/verify?token=DUMMY_TOKEN")

  expect(isError(verificationEmailContent)).toBe(false)

  const emailContent = verificationEmailContent as EmailContent
  expect(emailContent.subject).toMatchSnapshot()
  expect(emailContent.text).toMatchSnapshot()
  expect(emailContent.html).toMatchSnapshot()
})
