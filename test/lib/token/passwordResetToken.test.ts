import {
  decodePasswordResetToken,
  generatePasswordResetToken,
  PasswordResetTokenPayload
} from "lib/token/passwordResetToken"
import { isError } from "types/Result"

describe("generatePasswordResetToken()", () => {
  it("should return the token when payload is provided", () => {
    const payload: PasswordResetTokenPayload = {
      passwordResetCode: "123456",
      emailAddress: "dummy@example.com"
    }

    const result = generatePasswordResetToken(payload)

    expect(result).toBeDefined()
    expect(isError(result)).toBe(false)
  })

  it("should return error when payload is not valid", () => {
    const payload = null as unknown as PasswordResetTokenPayload

    const result = generatePasswordResetToken(payload)

    expect(result).toBeDefined()
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe(`Expected "payload" to be a plain object.`)
  })
})

describe("decodePasswordResetToken()", () => {
  it("should return decoded token when payload is provided", () => {
    const payload: PasswordResetTokenPayload = {
      passwordResetCode: "123456",
      emailAddress: "dummy@example.com"
    }
    const token = generatePasswordResetToken(payload) as string
    const result = decodePasswordResetToken(token)

    expect(result).toBeDefined()
    expect(isError(result)).toBe(false)

    const { passwordResetCode, emailAddress } = result as { passwordResetCode: string; emailAddress: string }
    expect(passwordResetCode).toBe(payload.passwordResetCode)
    expect(emailAddress).toBe(payload.emailAddress)
  })

  it("should return error when token is not valid", () => {
    const result = decodePasswordResetToken("Invalid token")

    expect(result).toBeDefined()
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("jwt malformed")
  })
})
