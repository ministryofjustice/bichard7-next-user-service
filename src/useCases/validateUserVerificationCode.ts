import config from "lib/config"
import Database from "types/Database"

const validateUserVerificationCode = async (connection: Database, emailAddress: string, verificationCode: string) => {
  if (verificationCode.length !== config.verificationCodeLength) {
    return new Error("No blip")
  }

  const query = `
    SELECT *
    FROM br7own.users
    WHERE email = $1
        AND email_verification_code = $2
    `

  const result = await connection.none(query, [emailAddress, verificationCode])

  console.log(result)

  return result
}

export default validateUserVerificationCode
