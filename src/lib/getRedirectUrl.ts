import { UserServiceConfig } from "lib/config"

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

const getRedirectUrl = (query: any, config: UserServiceConfig): string | boolean => {
  const redirectUrl = query && query.redirect

  if (!!redirectUrl && isValidRedirectUrl(query.redirect as string, config.redirectAccessList)) {
    return redirectUrl
  }
  return false
}

export default getRedirectUrl
