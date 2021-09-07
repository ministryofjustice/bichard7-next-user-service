import { GetServerSidePropsContext } from "next"
import AuditLog from "types/AuditLog"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import KeyValuePair from "types/KeyValuePair"

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

  return new AuditLog(action, currentUser?.username ?? "Anonymous", String(remoteAddress), String(url), attributes)
}
