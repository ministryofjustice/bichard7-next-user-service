import getConnection from "lib/getConnection"
import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { isError } from "types/Result"
import getUsersLastLogin from "./getUsersLastLogin"

export default async ({ emailAddress }: AuthenticationTokenPayload): Promise<boolean> => {
  const lastLogIn = await getUsersLastLogin(getConnection(), emailAddress)
  if (!lastLogIn || isError(lastLogIn)) {
    return true
  }
  return false
}
