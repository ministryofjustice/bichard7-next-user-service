import { GetServerSidePropsContext } from "next"
import AuditLog from "types/AuditLog"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import AuditLogEvent from "types/AuditLogEvent"
import KeyValuePair from "types/KeyValuePair"

type AttributesWithUser = { user?: { username?: string } }

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
  event: AuditLogEvent,
  attributes?: KeyValuePair<string, unknown>
): AuditLog => {
  const {
    req: { socket, url },
    currentUser
  } = context as AuthenticationServerSidePropsContext

  const remoteAddress = String(socket?.remoteAddress)
  const username = currentUser?.username ?? (attributes as AttributesWithUser)?.user?.username ?? "Anonymous"

  return new AuditLog(
    event.getDescription(),
    event.getCode(),
    username,
    remoteAddress,
    String(url),
    filterAttributes(attributes)
  )
}
