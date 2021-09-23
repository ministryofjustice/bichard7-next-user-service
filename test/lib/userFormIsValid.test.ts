import userFormIsValid from "lib/userFormIsValid"
import UserCreateDetails from "types/UserDetails"

describe("userFormIsValid", () => {
  it("should return false when username is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "",
      forenames: "test-value-01",
      surname: "test-value-02",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe("Username is mandatory")
    expect(emailError).toBe(false)
  })

  it("should return false when forenames is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "",
      surname: "test-value-02",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe("Forenames is mandatory")
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })

  it("should return false when surname is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe("Surname is mandatory")
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })

  it("should return false when emailAddress is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      emailAddress: ""
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe("Email address is mandatory")
  })

  it("should return true when all relevant fields are valid", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      emailAddress: "test-value-05"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(true)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })
})
