import UserGroup from "./UserGroup"

interface User {
  id: string
  username: string
  exclusionList: string[]
  inclusionList: string[]
  endorsedBy: string
  orgServes: string
  forenames: string
  surname: string
  emailAddress: string
  postalAddress: string
  postCode: string
  phoneNumber: string
  groups: UserGroup[]
}

export default User
