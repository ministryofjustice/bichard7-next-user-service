import User from "types/User"

export default async (connection: any, expectedUser: User): Promise<void> => {
  const deleteQuery = `DELETE FROM br7own.users WHERE username = $1`
  await connection.none(deleteQuery, [expectedUser.username])
}
