import QueryString from "qs"
import updateUserCodes from "useCases/updateUserCodes"

const typeOfCodes = "prefix"

it("should return new codes if old codes are empty", () => {
  const singleCode = { id: "001", name: "London Met" }
  const formData: QueryString.ParsedQs = {}
  formData.prefix001 = "true"

  const result = updateUserCodes(undefined, [singleCode], typeOfCodes, formData)
  expect(result).toBe("001,")
})

it("should append extra codes if they need to be added", () => {
  const singleCode = { id: "001", name: "London Met" }
  const formData = { prefix000: "true", prefix001: "true" }

  const result = updateUserCodes("000,", [singleCode], typeOfCodes, formData)
  expect(result).toBe("000,001,")
})
