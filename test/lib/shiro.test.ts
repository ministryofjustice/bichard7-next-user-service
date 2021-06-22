import { compare, hash } from "lib/shiro"
import "console"

describe("Shiro hash compare function", () => {
  it("should return true when the password matches the hash", async () => {
    const password = "password"
    const passwordHash = "$shiro1$SHA-256$50$aM1B7pQrWYUKFz47XN9Laj==$ojEUGc3/wMtVxmKSwH8K22zSXNKlelnkdywPLE4IYcg="
    const result = await compare(password, passwordHash)
    expect(result).toBe(true)
  })

  it("should return false when the password does not match the hash", async () => {
    const password = "foobar"
    const passwordHash = "$shiro1$SHA-256$50$aM1B7pQrWYUKFz47XN9Laj==$ojEUGc3/wMtVxmKSwH8K22zSXNKlelnkdywPLE4IYcg="
    const result = await compare(password, passwordHash)
    expect(result).toBe(false)
  })

  it("should throw an error when the hash is malformed", async () => {
    const password = "password"
    const passwordHash = "$shiro1$SHA-256$50$aM1B7pQrWYUKFz47XN9Laj=="
    await expect(compare(password, passwordHash)).rejects.toThrow(/malformed/i)
  })

  it("should throw an error when the hash version is an unexpected value", async () => {
    const password = "password"
    const passwordHash = "$foobar$SHA-256$50$aM1B7pQrWYUKFz47XN9Laj==$ojEUGc3/wMtVxmKSwH8K22zSXNKlelnkdywPLE4IYcg="
    await expect(compare(password, passwordHash)).rejects.toThrow(/hash version/i)
  })

  it("should throw an error when the hash version is an unexpected value", async () => {
    const password = "password"
    const passwordHash = "$shiro1$SHA-128$500$aM1B7pQrWYUKFz47XN9Laj==$ojEUGc3/wMtVxmKSwH8K22zSXNKlelnkdywPLE4IYcg="
    await expect(compare(password, passwordHash)).rejects.toThrow(/hash algorithm/i)
  })
})

describe("Shiro hash generation function", () => {
  it("should generate the correct hash for a given set of parameters", async () => {
    const password = "password"
    const b64Salt = "aM1B7pQrWYUKFz47XN9Laj=="
    const iterations = 50
    const shiroHash = await hash(password, b64Salt, iterations)
    expect(shiroHash).toEqual("ojEUGc3/wMtVxmKSwH8K22zSXNKlelnkdywPLE4IYcg=")
  })

  it("should generate different hashes when different salts are used", async () => {
    const password = "password"
    const iterations = 10
    const hash1 = await hash(password, "aM1B7pQrWYUKFz47XN9Laj==", iterations)
    const hash2 = await hash(password, "bM1B7pQrWYUKFz47XN9Laj==", iterations)
    expect(hash1).not.toEqual(hash2)
  })

  it("should generate different hashes for different iterations", async () => {
    const password = "password"
    const b64Salt = "aM1B7pQrWYUKFz47XN9Laj=="
    const hash1 = await hash(password, b64Salt, 10)
    const hash2 = await hash(password, b64Salt, 11)
    expect(hash1).not.toEqual(hash2)
  })
})
