import UserCreateDetails from "types/UserDetails"

const userFormIsValid = (userCreateDetails: Partial<UserCreateDetails>) =>
  userCreateDetails.username !== "" &&
  userCreateDetails.forenames !== "" &&
  userCreateDetails.surname !== "" &&
  userCreateDetails.phoneNumber !== "" &&
  userCreateDetails.emailAddress !== ""

export default userFormIsValid
