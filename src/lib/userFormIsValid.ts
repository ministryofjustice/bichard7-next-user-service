import KeyValuePair from "types/KeyValuePair"
import User from "types/User"
import UserCreateDetails from "types/UserDetails"
import validateCjsmEmailAddress from "useCases/validateCjsmEmailAddress"
import { UserServiceConfig } from "./config"

interface ValidationResult {
  usernameError: string | false
  forenamesError: string | false
  surnameError: string | false
  emailError: string | false
  isFormValid: boolean
}

const userFormIsValid = (
  config: UserServiceConfig,
  { username, forenames, surname, emailAddress }: Partial<User> | Partial<UserCreateDetails>,
  isEdit: boolean
): ValidationResult => {
  const validationResult = {
    forenamesError: !forenames?.trim() && "Enter the user's forename(s)",
    surnameError: !surname?.trim() && "Enter the user's surname"
  } as ValidationResult

  if (!isEdit) {
    validationResult.usernameError = !username?.trim() && "Enter a username for the new user"
    validationResult.emailError = !emailAddress?.trim() && "Enter the user's email address"

    if (emailAddress && !validationResult.emailError) {
      if (!validateCjsmEmailAddress(config, emailAddress)) {
        validationResult.emailError = "Enter a CJSM email address"
      }
    }
  }

  validationResult.isFormValid =
    Object.keys(validationResult).filter(
      (key) => !!(validationResult as unknown as KeyValuePair<string, string | false>)[key]
    ).length === 0

  return validationResult
}

export default userFormIsValid
