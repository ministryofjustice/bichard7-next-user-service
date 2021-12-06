import getBaseUrl from "lib/getBaseUrl"

it("should remove the path from a url", () => {
  const url = getBaseUrl("http://test-url:1234/path?query=true")
  expect(url).toEqual("http://test-url:1234")
})

it("should return null if the input is undefined", () => {
  const url = getBaseUrl()
  expect(url).toBeNull()
})

it("should return null if the input is invalid", () => {
  const url = getBaseUrl("invalidUrl")
  expect(url).toBeNull()
})
