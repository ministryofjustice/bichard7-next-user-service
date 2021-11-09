import { UserGroupResult } from "./UserGroup"

interface User {
  id: number
  username: string
  exclusionList: string[]
  inclusionList: string[]
  endorsedBy: string
  orgServes: string
  forenames: string
  surname: string
  emailAddress: string
  groups: UserGroupResult[]
  visibleCourts: string
  visibleForces: string
  excludedTriggers: string
}

export default User
