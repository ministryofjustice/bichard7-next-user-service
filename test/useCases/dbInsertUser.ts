import User from "types/User"

export default async (connection: any, expectedUser: User, isDeleted: boolean, password: string): Promise<void> => {
  const deletedAt = isDeleted ? new Date() : null

  const insertQuery = `
    INSERT INTO br7own.users(
      username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, endorsed_by, org_serves, forenames, surname, postal_address, post_code, phone_number, deleted_at, password)
      VALUES ($1, $2, true, $3, $4, '-', NOW(), $5, $6, $7, $8, $9, $10, $11, $12, $13);
  `
  await connection.none(insertQuery, [
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
