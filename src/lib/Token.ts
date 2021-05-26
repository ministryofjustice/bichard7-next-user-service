import { UserGroup } from "lib/User"

export type Token = string

export interface TokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  forenames: string
  surname: string
  emailAddress: string
  groups: UserGroup[]
}
