import { argon2id, hash, Options, verify } from "argon2"
import config from "./config"

const hashPassword = (plainPassword: string): Promise<string | null> => {
  const {
    argon2id: { parallelism, timeCost, memoryCost, hashLength, saltLength }
  } = config

  const defaultOptions: Options & { raw?: false } = {
    parallelism,
    timeCost,
    memoryCost,
    hashLength,
    saltLength,
    type: argon2id
  }

  return hash(plainPassword, defaultOptions).catch((error) => {
    console.error(error)
    return null
  })
}

const verifyPassword = (plainPassword: string, passwordHash: string): Promise<boolean> => {
  return verify(passwordHash, plainPassword).catch((error) => {
    console.error(error)
    return false
  })
}

export { hashPassword, verifyPassword }
