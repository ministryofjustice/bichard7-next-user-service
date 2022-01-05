import { GetServerSidePropsContext } from "next"
import AuditLogger from "types/AuditLogger"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import logger from "utils/logger"
import { UserServiceConfig } from "./config"
import generateAuditLog from "./generateAuditLog"

const getConsoleAuditLogger =
  (context: GetServerSidePropsContext): AuditLogger =>
  (action, attributes): PromiseResult<void> => {
    try {
      const {
        auditLogId,
        timestamp,
        action: auditAction,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes
      } = generateAuditLog(context, action, attributes)

      logger.info({
        component: "[Audit Logger]",
        auditLogId,
        timestamp: `${timestamp.toISOString()}`,
        action: auditAction,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes // pino stringifies objects to a depth of 5
      })
    } catch (error) {
      logger.error(error)
      return Promise.resolve(isError(error) ? error : Error("Error writing to log"))
    }

    return Promise.resolve()
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
