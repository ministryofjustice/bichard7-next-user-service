export interface UserCredentials {
  emailAddress: string
  password: string
}

export interface UserDetails {
  username: string
  forenames: string
  surname: string
  phoneNumber: string
  emailAddress: string
}

export type UserGroup =
  | "B7Allocator"
  | "B7Audit"
  | "B7ExceptionHandler"
  | "B7GeneralHandler"
  | "B7Supervisor"
  | "B7TriggerHandler"

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
