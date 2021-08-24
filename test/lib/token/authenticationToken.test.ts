import jwt from "jsonwebtoken"
import config from "lib/config"
import {
  AuthenticationTokenPayload,
  decodeAuthenticationToken,
  generateAuthenticationToken
} from "lib/token/authenticationToken"
import { isError } from "types/Result"
import User from "types/User"
import UserCredentials from "types/UserCredentials"

const user: User & UserCredentials = {
  id: 1,
  username: "bichard01",
  exclusionList: ["1", "2", "3", "4"],
  inclusionList: ["5", "6", "7", "8"],
  endorsedBy: "Endorser Not found",
  orgServes: "048C600",
  forenames: "Bichard User",
  surname: "01",
  emailAddress: "bichard01@example.com",
  postalAddress: "Addr1$Addr2",
  postCode: "SW1H",
  phoneNumber: "1234",
  groups: ["B7Supervisor"],
  password: "$shiro1$SHA-256$500000$foo$bar",
  verificationCode: "123456"
}

describe("generateAuthenticationToken()", () => {
  it("should return a string that looks like a token", () => {
    const result = generateAuthenticationToken(user)
    expect(result).toEqual(expect.stringMatching(/^[a-z0-9]+\.[a-z0-9]+\.[a-z0-9_-]+$/i))
  })

  it("should return a token that can be successfully decoded and verified", () => {
    const token = generateAuthenticationToken(user)
    const payload = jwt.verify(token, config.tokenSecret, { issuer: config.tokenIssuer })

    const expectedPayload = {
      username: user.username,
      exclusionList: user.exclusionList,
      inclusionList: user.inclusionList,
      emailAddress: user.emailAddress,
      groups: user.groups
    }

    expect(payload).toEqual(expect.objectContaining(expectedPayload))
  })

  it("should return a token only containing the minimum information", () => {
    const token = generateAuthenticationToken(user)
    const payload = jwt.decode(token)

    expect(payload).not.toHaveProperty("endorsedBy")
    expect(payload).not.toHaveProperty("orgServes")
    expect(payload).not.toHaveProperty("forenames")
    expect(payload).not.toHaveProperty("surname")
    expect(payload).not.toHaveProperty("postalAddress")
    expect(payload).not.toHaveProperty("postCode")
    expect(payload).not.toHaveProperty("phoneNumber")
    expect(payload).not.toHaveProperty("password")
    expect(payload).not.toHaveProperty("verificationCode")
  })
})

describe("decodePasswordResetToken()", () => {
  it("should return decoded token when payload is provided", () => {
    const token = generateAuthenticationToken(user) as string
    const result = decodeAuthenticationToken(token)

    expect(result).toBeDefined()
    expect(isError(result)).toBe(false)

    const { username, emailAddress, inclusionList, exclusionList, groups } = result as AuthenticationTokenPayload
    expect(emailAddress).toBe(user.emailAddress)
    expect(username).toBe(user.username)
    expect(inclusionList).toEqual(user.inclusionList)
    expect(exclusionList).toEqual(user.exclusionList)
    expect(groups).toEqual(user.groups)
  })

  it("should return error when token is not valid", () => {
    const result = decodeAuthenticationToken("Invalid token")

    expect(result).toBeDefined()
    expect(isError(result)).toBe(true)

    const actualError = <Error>result
    expect(actualError.message).toBe("jwt malformed")
  })
})
