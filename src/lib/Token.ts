import { UserGroup } from "lib/User"

export type Token = string

export interface BichardTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  forenames: string
  surname: string
  emailAddress: string
  groups: UserGroup[]
}

export interface EmailTokenPayload {
  emailAddress: string
  verificationCode: string
}
