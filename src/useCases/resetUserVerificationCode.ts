import Database from "types/Database"

const resetUserVerificationCode = async (connection: Database, emailAddress: string) => {
  const updateUserQuery = `
        UPDATE br7own.users
        SET email_verification_code = NULL
        WHERE email = $1
      `

  await connection.none(updateUserQuery, [emailAddress])
}

export default resetUserVerificationCode
