import { UserServiceConfig } from "lib/config"
import { ParsedUrlQuery } from "querystring"

export const getDomainMatch = (url: string): string => new URL(url).hostname

export const isValidRedirectUrl = (redirect: string, redirectAccessList: string): boolean => {
  const accessList = redirectAccessList.split(",")
  const accessListLen = accessList.length
  const domain = getDomainMatch(redirect)

  if (domain === "") {
    return false
  }

  for (let i = 0; i < accessListLen; i++) {
    if (accessList[i] === domain) {
      return true
    }
  }

  return false
}

const getRedirectUrl = (query: ParsedUrlQuery, config: UserServiceConfig): string | boolean => {
  const redirectParameter = query.redirect as string

  if (!!redirectParameter && isValidRedirectUrl(redirectParameter, config.redirectAccessList)) {
    return redirectParameter
  }

  return false
}

export default getRedirectUrl
