import KeyValuePair from "types/KeyValuePair"
import User from "types/User"
import UserCreateDetails from "types/UserDetails"

interface ValidationResult {
  usernameError: string | false
  forenamesError: string | false
  surnameError: string | false
  emailError: string | false
  isFormValid: boolean
}

const userFormIsValid = (
  { username, forenames, surname, emailAddress }: Partial<User> | Partial<UserCreateDetails>,
  isEdit: boolean
): ValidationResult => {
  const validationResult = {
    forenamesError: !forenames?.trim() && "Forenames is mandatory",
    surnameError: !surname?.trim() && "Surname is mandatory"
  } as ValidationResult

  if (!isEdit) {
    validationResult.usernameError = !username?.trim() && "Username is mandatory"
    validationResult.emailError = !emailAddress?.trim() && "Email address is mandatory"
  }

  validationResult.isFormValid =
    Object.keys(validationResult).filter(
      (key) => !!(validationResult as unknown as KeyValuePair<string, string | false>)[key]
    ).length === 0

  return validationResult
}

export default userFormIsValid
