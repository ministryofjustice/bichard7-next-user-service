import User from "types/User"

export default async (connection: any, expectedUser: User, isDeleted: boolean): Promise<void> => {
  const deletedAt = isDeleted ? new Date() : null
  const deleteQuery = `
    DELETE FROM br7own.users WHERE username = $1
  `
  await connection.none(deleteQuery, [expectedUser.username])

  const insertQuery = `
    INSERT INTO br7own.users(
      username, email, active, exclusion_list, inclusion_list, challenge_response, created_at, endorsed_by, org_serves, forenames, surname, postal_address, post_code, phone_number)
      VALUES ($1, $2, true, $3, $4, '-', NOW(), $5, $6, $7, $8, $9, $10, $11);
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
    expectedUser.phoneNumber
  ])
}