import CreateUserResult from "types/CreateUserResult"
import UserCreateDetails from "types/UserDetails"
import PromiseResult from "types/PromiseResult"
import Database from "types/Database"
import isUsernameUnique from "./isUsernameUnique"
import isEmailUnique from "./IsEmailUnique"

export default async (connection: Database, userDetails: UserCreateDetails): PromiseResult<CreateUserResult> => {
  let checkData = await isUsernameUnique(connection, userDetails.username)
  if (checkData.message !== "") {
    return new Error(checkData.message)
  }
  checkData = await isEmailUnique(connection, userDetails.emailAddress)
  if (checkData.message !== "") {
    return new Error(checkData.message)
  }
  const {
    username,
    forenames,
    surname,
    phoneNumber,
    emailAddress,
    postCode,
    postalAddress,
    endorsedBy,
    organisation
  }: UserCreateDetails = userDetails

  const query = `
      INSERT INTO br7own.users(
        username,
        forenames,
        surname,
        phone_number,
        email,
        active,
        exclusion_list,
        inclusion_list,
        challenge_response,
        post_code,
        postal_address,
        endorsed_by,
        org_serves
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        true,
        '',
        '',
        '',
        $6,
        $7,
        $8,
        $9
      )
    `
  let result = ""
  try {
    result = (
      await connection.any(query, [
        username,
        forenames,
        surname,
        phoneNumber,
        emailAddress,
        postCode,
        postalAddress,
        endorsedBy,
        organisation
      ])
    ).toString()
  } catch (e) {
    return new Error("Error: Failed to add user")
  }

  return { result }
}
