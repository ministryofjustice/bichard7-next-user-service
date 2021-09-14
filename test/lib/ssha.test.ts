import { createSsha, verifySsha } from "lib/ssha"

it("should verify SSHA secret", () => {
  const result = verifySsha("should verify SSHA secret", "{SSHA}aUbJsuyAq1gp7pNjLNKQUPCC9FB1JFoq")

  expect(result).toBe(true)
})

it("should not verify incorrect SSHA secret", () => {
  const result = verifySsha("should not verify SSHA secret", "{SSHA}aUbJsuyAq1gp7pNjLNKQUPCC9FB1JFoq")

  expect(result).toBe(false)
})

it("should generate and verify SSHA secret", () => {
  const secret = "should generate and verify SSHA secret"
  const hash = createSsha(secret)
  const result = verifySsha(secret, hash)

  expect(result).toBe(true)
})
