import db from "lib/db"

const CheckName = "Pre-create user check"

export default async (email: string): Promise<Error> => {
  const query = `SELECT COUNT(1) FROM br7own.users WHERE LOWER(email) = LOWER('${email}')`
  const result = await db.any(query)
  return !(result.length === 1 && result[0].count === "1")
    ? { name: CheckName, message: "" }
    : { name: CheckName, message: `Error: Email address ${email} already exists` }
}
