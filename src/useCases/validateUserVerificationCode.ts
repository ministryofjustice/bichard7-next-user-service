import config from "lib/config"
import Database from "types/Database"
import { isError, PromiseResult } from "types/Result"

const validateUserVerificationCode = async (
  connection: Database,
  emailAddress: string,
  verificationCode: string
): PromiseResult<void> => {
  if (verificationCode.length !== config.verificationCodeLength) {
    return new Error("Error: Invalid Verification Code ")
  }
  const query = `
    SELECT *
    FROM br7own.users
    WHERE email = $1
        AND password_reset_code = $2
    `

  const result = await connection.result(query, [emailAddress, verificationCode])
  if (isError(result)) {
    return result
  }

  if (result.rowCount === 0) {
    return Error("Error: No results")
  }

  return undefined
}

export default validateUserVerificationCode
