import userFormIsValid from "lib/userFormIsValid"
import UserCreateDetails from "types/UserDetails"

describe("userFormIsValid", () => {
  it("should return false when username is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "",
      forenames: "test-value-01",
      surname: "test-value-02",
      phoneNumber: "test-value-03",
      emailAddress: "test-value-04"
    }

    const isValid = userFormIsValid(userDetails)

    expect(isValid).toBe(false)
  })

  it("should return false when forenames is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "",
      surname: "test-value-02",
      phoneNumber: "test-value-03",
      emailAddress: "test-value-04"
    }

    const isValid = userFormIsValid(userDetails)

    expect(isValid).toBe(false)
  })

  it("should return false when surname is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "",
      phoneNumber: "test-value-03",
      emailAddress: "test-value-04"
    }

    const isValid = userFormIsValid(userDetails)

    expect(isValid).toBe(false)
  })

  it("should return false when phoneNumber", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      phoneNumber: "",
      emailAddress: "test-value-04"
    }

    const isValid = userFormIsValid(userDetails)

    expect(isValid).toBe(false)
  })

  it("should return false when emailAddress is empty", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      phoneNumber: "test-value-04",
      emailAddress: ""
    }

    const isValid = userFormIsValid(userDetails)

    expect(isValid).toBe(false)
  })

  it("should return true when all relevant fields are valid", () => {
    const userDetails: Partial<UserCreateDetails> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      phoneNumber: "test-value-04",
      emailAddress: "test-value-05"
    }

    const isValid = userFormIsValid(userDetails)

    expect(isValid).toBe(true)
  })
})
