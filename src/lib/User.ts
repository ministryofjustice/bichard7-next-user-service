import { UserGroup } from "./UserGroup"

export interface UserCredentials {
  emailAddress: string
  password: string
  verificationCode: string
}

export interface User {
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
