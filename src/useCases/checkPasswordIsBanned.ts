import bannedPasswords from "lib/bannedPasswords"
import { Result } from "types/Result"

const bannedPasswordsDictionary = Object.assign({}, ...bannedPasswords.split("\n").map((word) => ({ [word]: true })))

const checkPasswordIsBanned = (newPassword: string): Result<void> => {
  if (newPassword in bannedPasswordsDictionary) {
    return Error("Cannot use this password as it is unsecure/banned")
  }

  return undefined
}

export default checkPasswordIsBanned
