import { UserServiceConfig } from "lib/config"

export default (config: UserServiceConfig, emailAddress: string): boolean => {
  const { validateCjsmEmailAddress } = config

  return validateCjsmEmailAddress !== "true" || !!emailAddress.match(/^.*cjsm.net$/)
}
