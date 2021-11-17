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
  // We add dynamic properties to this type for form data so we need this to avoid use of unknown
  [key: string]: unknown
}

export default User
