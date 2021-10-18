const addCjsmSuffix = (emailAddress: string): string => {
  if (emailAddress.match(/\.cjsm\.net$/i)) {
    return emailAddress
  }

  return `${emailAddress}.cjsm.net`
}

const removeCjsmSuffix = (emailAddress: string): string => {
  return emailAddress.replace(/\.cjsm\.net$/i, "")
}

export { addCjsmSuffix, removeCjsmSuffix }
