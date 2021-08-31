import { IncomingMessage } from "http"

export default (request: IncomingMessage) => {
  return request.method === "POST"
}
