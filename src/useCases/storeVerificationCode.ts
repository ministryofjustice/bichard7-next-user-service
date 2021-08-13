import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default async (connection: Database, emailAddress: string, verificationCode: string): PromiseResult<void> => {
  const storeVerificationQuery = `
    UPDATE br7own.users
    SET email_verification_code = $1,
      email_verification_generated = NOW()
    WHERE email = $2 AND deleted_at IS NULL
  `
  const result = await connection.none(storeVerificationQuery, [verificationCode, emailAddress]).catch((error) => error)

  return result
}
