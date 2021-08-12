export default async (connection: any, username: string): Promise<void> => {
  const deleteQuery = `DELETE FROM br7own.users WHERE username = $1`
  await connection.none(deleteQuery, [username])
}
