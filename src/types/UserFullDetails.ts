import UserGroup from "./UserGroup"

interface UserFullDetails {
  id: number
  username: string
  exclusionList: string[]
  inclusionList: string[]
  endorsedBy: string
  orgServes: string
  forenames: string
  surname: string
  emailAddress: string
  emailVerificationCode: string
  emailVerificationCurrent: string
  password: string
  migratedPassword: string
  groups: UserGroup[]
  loginTooSoon: boolean
  deletedAt: Date
}

export default UserFullDetails
