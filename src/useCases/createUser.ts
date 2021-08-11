import { CreateUserResult } from "lib/CreateUserResult"
import { UserCreateDetails } from "lib/UserCreateDetails"
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
        '${userCreateDetails.username}',
        '${userCreateDetails.forenames}',
        '${userCreateDetails.surname}',
        '${userCreateDetails.phoneNumber}',
        '${userCreateDetails.emailAddress}',
        true,
        '',
        '',
        '',
        ${userCreateDetails.postCode},
        ${userCreateDetails.postalAddress},
        ${userCreateDetails.endorsedBy},
        ${userCreateDetails.organisation}
      )
    `
  let errorMessage = ""
  let result = ""
  try {
    result = (await connection.any(query)).toString()
  } catch (e) {
    errorMessage = "Error: Failed to add user"
  }

  return { result, error: { name: "Failed Add User", message: errorMessage } }
}
