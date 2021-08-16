import CreateUserResult from "types/CreateUserResult"
import UserCreateDetails from "types/UserDetails"
import isUsernameUnique from "./isUsernameUnique"
import isEmailUnique from "./IsEmailUnique"

export default async (connection: any, userCreateDetails: UserCreateDetails): Promise<CreateUserResult> => {
  let checkData = await isUsernameUnique(connection, userCreateDetails.username)
  if (checkData.message !== "") {
    return { result: "", error: checkData }
  }
  checkData = await isEmailUnique(connection, userCreateDetails.emailAddress)
  if (checkData.message !== "") {
    return { result: "", error: checkData }
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
  }: UserCreateDetails = userCreateDetails

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
  let errorMessage = ""
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
    errorMessage = "Error: Failed to add user"
  }

  return { result, error: { name: "Failed Add User", message: errorMessage } }
}
