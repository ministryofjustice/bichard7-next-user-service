import jwt from "jsonwebtoken"

export default (cookies: string[], cookieName: string) => {
  for (let i = 0; i < cookies.length; i += 1) {
    const [key, val] = cookies[i].trim().split("=").map(decodeURIComponent)
    if (key === cookieName) {
      const jwtToken = val.split(";")[0]
      const result = jwt.decode(jwtToken)
      if (result !== null && typeof result !== "string") {
        return result
      }
    }
  }
  return undefined
}
