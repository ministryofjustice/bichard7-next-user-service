import { createHash, randomBytes } from "crypto"

interface ShiroHash {
  version: string
  algorithm: string
  iterations: number
  salt: string
  passwordHash: string
}

// eslint-disable-next-line require-await
export async function hash(password: string, b64Salt: string, iterations: number): Promise<string> {
  const salt = Buffer.from(b64Salt, "base64")

  // Iteration 0
  let value = createHash("sha256").update(salt).update(password).digest()

  // Iterations 1..(iterations - 1)
  for (let i = 0; i < iterations - 1; i++) {
    value = createHash("sha256").update(value).digest()
  }

  return value.toString("base64")
}

export async function compare(password: string, passwordHash: string): Promise<boolean> {
  const hashParts = passwordHash.split("$")

  if (hashParts.length !== 6) {
    throw new Error("Malformed hash")
  }

  const shiroHash: ShiroHash = {
    version: hashParts[1],
    algorithm: hashParts[2],
    iterations: Number(hashParts[3]),
    salt: hashParts[4],
    passwordHash: hashParts[5]
  }

  if (shiroHash.version !== "shiro1") {
    throw new Error("Unsupported hash version")
  }

  if (shiroHash.algorithm !== "SHA-256") {
    throw new Error("Unsupported hash algorithm")
  }

  const newHash = await hash(password, shiroHash.salt, shiroHash.iterations)

  return newHash === shiroHash.passwordHash
}

export const createPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("base64")
  const iterations = (Math.floor(Math.random() * 6) + 1) * 100000
  const passwordHash = await hash(password, salt, iterations)
  const parts = ["shiro1", "SHA-256", iterations, salt, passwordHash]

  return `$${parts.join("$")}`
}
