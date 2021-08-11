const CheckName = "Pre-create user check"

export default async (connection: any, username: string): Promise<Error> => {
  const query = `SELECT COUNT(1) FROM br7own.users WHERE LOWER(username) = LOWER($1)`
  const result = await connection.any(query, [username])
  return !(result.length === 1 && result[0].count === "1")
    ? { name: CheckName, message: "" }
    : { name: CheckName, message: `Error: Username ${username} already exists` }
}
