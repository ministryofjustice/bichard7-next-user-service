import User from "types/User"

const userFormIsValid = (userCreateDetails: Partial<User>) =>
  userCreateDetails.username !== "" &&
  userCreateDetails.forenames !== "" &&
  userCreateDetails.surname !== "" &&
  userCreateDetails.phoneNumber !== "" &&
  userCreateDetails.emailAddress !== ""

export default userFormIsValid
