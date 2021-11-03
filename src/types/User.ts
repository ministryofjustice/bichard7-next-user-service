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
  groupId: number
  visibleCourts: string
  visibleForces: string
  excludedTriggers: string
}

export default User
