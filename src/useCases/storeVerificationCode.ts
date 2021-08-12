import Database from "types/Database"

const storeVerificationCode = async (connection: Database, emailAddress: string, verificationCode: string) => {
  const storeVerificationQuery = `
    UPDATE br7own.users
    SET email_verification_code = $1,
      email_verification_generated = NOW()
    WHERE email = $2 AND deleted_at IS NULL
  `
  try {
    await connection.none(storeVerificationQuery, [verificationCode, emailAddress])
    return true
  } catch (error) {
    return error
  }
}

export default storeVerificationCode
