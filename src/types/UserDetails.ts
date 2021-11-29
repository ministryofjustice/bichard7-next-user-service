import { UserGroupResult } from "./UserGroup";

interface UserDetails {
  username: string
  forenames: string
  surname: string
  emailAddress: string
  endorsedBy: string
  orgServes: string
  groups: UserGroupResult[]
}

export default UserDetails
