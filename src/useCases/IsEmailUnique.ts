import Database from "types/Database"

const CheckName = "Pre-create user check"

export default async (connection: Database, email: string): Promise<Error> => {
  const query = `SELECT COUNT(1) FROM br7own.users WHERE LOWER(email) = LOWER($1)`
  const result = await connection.any(query, [email])
  return !(result.length === 1 && result[0].count === "1")
    ? { name: CheckName, message: "" }
    : { name: CheckName, message: `Error: Email address ${email} already exists` }
}
