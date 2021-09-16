/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { hashPassword, verifyPassword } from "lib/argon2"

it("should generate correct hash format", async () => {
  const hash = await hashPassword("Dummy password")

  expect(hash).toMatch(/\$argon2id\$v=19\$m=16384,t=10,p=2\$.+/)
})

it("should verify the password when correct password is provided", async () => {
  const plainPassword = "This is a dummy password"
  const hash = await hashPassword(plainPassword)

  expect(hash).toBeDefined()

  const result = await verifyPassword(plainPassword, hash!)

  expect(result).toBe(true)
})

it("should not verify the password when incorrect password is provided", async () => {
  const hash = await hashPassword("This is a dummy password")

  expect(hash).toBeDefined()

  const result = await verifyPassword("Incorrect password", hash!)

  expect(result).toBe(false)
})
