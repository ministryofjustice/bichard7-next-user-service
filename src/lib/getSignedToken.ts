import jwt from "jsonwebtoken"
import { BichardTokenPayload } from "lib/token/bichardToken"
import User from "types/User"
import config from "lib/config"

const getSignedToken = (user: User) => {
  const payload: BichardTokenPayload = {
    username: user.username,
    exclusionList: user.exclusionList,
    inclusionList: user.inclusionList,
    forenames: user.forenames,
    surname: user.surname,
    emailAddress: user.emailAddress,
    groups: user.groups
  }

  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    issuer: config.tokenIssuer
  }

  try {
    const token = jwt.sign(payload, config.tokenSecret, options)
    return token
  } catch (error) {
    return error
  }
}

export default getSignedToken
