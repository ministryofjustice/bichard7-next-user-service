import { GetServerSidePropsContext } from "next"
import AuditLog from "types/AuditLog"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import KeyValuePair from "types/KeyValuePair"

const filterAttributes = (
  attrs: KeyValuePair<string, unknown> | undefined
): KeyValuePair<string, unknown> | undefined => {
  if (!attrs) {
    return attrs
  }
  if (attrs.user && typeof attrs.user === "object") {
    const user = attrs.user as { password?: string; migratedPassword?: string; emailVerificationCode?: string }
    user.password = undefined
    user.migratedPassword = undefined
    user.emailVerificationCode = undefined
  }
  return attrs
}

export default (
  context: GetServerSidePropsContext,
  action: string,
  attributes?: KeyValuePair<string, unknown>
): AuditLog => {
  const {
    req: { socket, url },
    currentUser
  } = context as AuthenticationServerSidePropsContext

  const remoteAddress = socket?.remoteAddress

  return new AuditLog(
    action,
    currentUser?.username ?? "Anonymous",
    String(remoteAddress),
    String(url),
    filterAttributes(attributes)
  )
}
