import { IncomingMessage } from "http"
import User from "types/User"
import { getCaseDetailsCookieName } from "./getCaseDetailsCookieName"

const courtCaseDetailsRedirect = (req: IncomingMessage, currentUser: Partial<User> | undefined): string => {
  if (!currentUser) {
    return ""
  }

  const caseDetailsCookieName = getCaseDetailsCookieName(currentUser.username)

  if (!caseDetailsCookieName) {
    return ""
  }

  const cookies = req.headers.cookie?.split("; ")
  const regex = new RegExp(`${caseDetailsCookieName}=\\d+`)
  const caseDetailCookie = cookies?.find((c) => regex.test(c))
  const redirectToCourtDetails = caseDetailCookie?.replace(`${caseDetailsCookieName}=`, "")

  if (!redirectToCourtDetails) {
    return ""
  }

  const decodedCourtDetailsRedirect = decodeURIComponent(redirectToCourtDetails)
  const [errorId, previousPath] = decodedCourtDetailsRedirect.split("?previousPath=")
  const courtCaseDetails = `/court-cases/${errorId}?previousPath=${encodeURIComponent(previousPath)}`

  return courtCaseDetails
}

export default courtCaseDetailsRedirect
