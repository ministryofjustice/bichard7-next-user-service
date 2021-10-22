import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

export default async (connection: Database, emailAddress: string, verificationCode: string): PromiseResult<boolean> => {
  const storeVerificationQuery = `
    UPDATE br7own.users
    SET email_verification_code = $1,
      email_verification_generated = NOW()
    WHERE email = $2 AND deleted_at IS NULL
  `
  const result = await connection
    .result(storeVerificationQuery, [verificationCode, emailAddress])
    .catch((error) => error)

  if (isError(result)) {
    return result
  }

  return result.rowCount === 1
}
