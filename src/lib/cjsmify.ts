export default (emailAddress: string): string => {
  if (emailAddress.match(/\.cjsm\.net$/i)) {
    return emailAddress
  }

  return `${emailAddress}.cjsm.net`
}
