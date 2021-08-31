import { IncomingMessage } from "http"
import isPost from "utils/isPost"

it("should return true when request method is post", () => {
  const request = <IncomingMessage>{ method: "POST" }
  const isPostRequest = isPost(request)

  expect(isPostRequest).toBe(true)
})

it("should return true when request method is post", () => {
  const request = <IncomingMessage>{ method: "GET" }
  const isPostRequest = isPost(request)

  expect(isPostRequest).toBe(false)
})
