export default async (connection: any, id: number): Promise<void> => {
  const deleteQuery = `DELETE FROM br7own.users WHERE id = $1`
  await connection.none(deleteQuery, [id])
}
