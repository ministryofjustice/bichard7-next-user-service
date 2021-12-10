interface CjsmDomainException {
  domain: string
  cjsmDomain: string
}

const cjsmDomainExceptions: CjsmDomainException[] = [
  { domain: "madetech.com", cjsmDomain: "madetech.cjsm.net" },
  { domain: "soprasteria.com", cjsmDomain: "soprasteria.cjsm.net" }
]

const addCjsmSuffix = (emailAddress: string): string => {
  if (emailAddress.match(/\.cjsm\.net$/i)) {
    return emailAddress
  }

  for (let i = 0; i < cjsmDomainExceptions.length; i++) {
    const domainRegex = new RegExp(`${cjsmDomainExceptions[i].domain}$`, "i")
    if (emailAddress.match(domainRegex)) {
      return emailAddress.replace(domainRegex, cjsmDomainExceptions[i].cjsmDomain)
    }
  }

  return `${emailAddress}.cjsm.net`
}

const removeCjsmSuffix = (emailAddress: string): string => {
  for (let i = 0; i < cjsmDomainExceptions.length; i++) {
    const cjsmRegex = new RegExp(`${cjsmDomainExceptions[i].cjsmDomain}$`, "i")
    if (emailAddress.match(cjsmRegex)) {
      return emailAddress.replace(cjsmRegex, cjsmDomainExceptions[i].domain)
    }
  }
  return emailAddress.replace(/\.cjsm\.net$/i, "")
}

export { addCjsmSuffix, removeCjsmSuffix }
