import User from "types/User"

export default async (connection: any, expectedUser: User, isDeleted: boolean, password: string): Promise<void> => {
  const deletedAt = isDeleted ? new Date() : null

  const insertQuery = `
    INSERT INTO br7own.users(
      id, username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, endorsed_by, org_serves, forenames, surname, postal_address, post_code, phone_number, deleted_at, password)
      VALUES ($1, $2, $3, true, $4, $5, '-', NOW(), $6, $7, $8, $9, $10, $11, $12, $13, $14);
  `
  await connection.none(insertQuery, [
    expectedUser.id || Math.floor(Math.random() * 100000),
    expectedUser.username,
    expectedUser.emailAddress,
    expectedUser.exclusionList,
    expectedUser.inclusionList,
    expectedUser.endorsedBy,
    expectedUser.orgServes,
    expectedUser.forenames,
    expectedUser.surname,
    expectedUser.postalAddress,
    expectedUser.postCode,
    expectedUser.phoneNumber,
    deletedAt,
    password
  ])
}
