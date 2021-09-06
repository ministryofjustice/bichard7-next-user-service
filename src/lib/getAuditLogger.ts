import { GetServerSidePropsContext } from "next"
import AuditLogger from "types/AuditLogger"
import { UserServiceConfig } from "./config"
import generateAuditLog from "./generateAuditLog"

const getConsoleAuditLogger =
  (context: GetServerSidePropsContext): AuditLogger =>
  // eslint-disable-next-line require-await
  async (action, attributes) => {
    const auditLog = generateAuditLog(context, action, attributes)

    console.log("[Audit Logger]")
    console.log(`Audit Log ID:  ${auditLog.auditLogId}`)
    console.log(`Timestamp:     ${auditLog.timestamp.toISOString()}`)
    console.log(`Action:        ${auditLog.action}`)
    console.log(`Username:      ${auditLog.username}`)
    console.log(`User IP:       ${auditLog.userIp}`)
    console.log(`Request URI:   ${auditLog.requestUri}`)
    console.log(`\n${JSON.stringify(auditLog.attributes)}`)
  }

export default (context: GetServerSidePropsContext, config: UserServiceConfig): AuditLogger => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { auditLogger } = context as unknown as { auditLogger: AuditLogger }

  if (auditLogger) {
    return auditLogger
  }

  if (config.auditLoggerType !== "console") {
    throw new Error("Unknown audit logger type.")
  }

  auditLogger = getConsoleAuditLogger(context)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(context as any).auditLogger = auditLogger

  return auditLogger
}
