import jwt from "jsonwebtoken"

const tokenSecret = "OliverTwist"

export const invalidToken = () => jwt.sign({ foo: "bar" }, tokenSecret, { issuer: "Bichard" })

export const validToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })
