import config from "lib/config"
import validateCjsmEmailAddress from "useCases/validateCjsmEmailAddress"

it("should return true if CJSM email address validation is disabled", () => {
  const customConfig = { ...config, validateCjsmEmailAddress: "false" }

  const result = validateCjsmEmailAddress(customConfig, "non_cjsm_email_address@example.com")

  expect(result).toBe(true)
})

it("should return false if email address is not a CJSM address", () => {
  const customConfig = { ...config, validateCjsmEmailAddress: "true" }

  const result = validateCjsmEmailAddress(customConfig, "non_cjsm_email_address@example.com")

  expect(result).toBe(false)
})

it("should return true if email address is a CJSM address", () => {
  const customConfig = { ...config, validateCjsmEmailAddress: "true" }

  const result = validateCjsmEmailAddress(customConfig, "non_cjsm_email_address@example.cjsm.net")

  expect(result).toBe(true)
})
