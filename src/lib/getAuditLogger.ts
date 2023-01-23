import { GetServerSidePropsContext } from "next"
import AuditLogger from "types/AuditLogger"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import logger from "utils/logger"
import { UserServiceConfig } from "./config"
import generateAuditLog from "./generateAuditLog"
import axios from "axios"

enum HttpStatus {
  Created = 201
}

const getApiAuditLogger =
  (context: GetServerSidePropsContext, config: UserServiceConfig): AuditLogger =>
  async (event, attributes): PromiseResult<void> => {
    try {
      const {
        timestamp,
        action,
        eventCode,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes
      } = generateAuditLog(context, event, attributes)

      const userEvent = {
        eventSource: "User Service",
        category: "information",
        eventType: action,
        timestamp: `${timestamp.toISOString()}`,
        attributes: {
          auditLogVersion: "2",
          eventCode,
          "Request URI": requestUri,
          "User IP": userIp,
          ...auditAttributes
        }
      }

      const apiResult = await axios.post(`users/${username}/events`, userEvent, {
        baseURL: config.auditLogApiUrl,
        headers: {
          "X-API-Key": config.auditLogApiKey
        }
      })

      if (apiResult.status !== HttpStatus.Created) {
        return Error(`Could not log event. API returned ${apiResult.status}. ${apiResult.data}`)
      }
    } catch (error) {
      logger.error(error)
      return isError(error) ? error : Error("Error writing to log")
    }
  }

const getConsoleAuditLogger =
  (context: GetServerSidePropsContext): AuditLogger =>
  (event, attributes): PromiseResult<void> => {
    try {
      const {
        auditLogId,
        timestamp,
        action,
        eventCode,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes
      } = generateAuditLog(context, event, attributes)

      logger.info({
        component: "[Audit Logger]",
        auditLogId,
        timestamp: `${timestamp.toISOString()}`,
        action,
        eventCode,
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

  if (config.auditLoggerType === "console") {
    auditLogger = getConsoleAuditLogger(context)
  } else if (config.auditLoggerType === "audit-log-api") {
    auditLogger = getApiAuditLogger(context, config)
  } else {
    throw new Error("Unknown audit logger type.")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(context as any).auditLogger = auditLogger

  return auditLogger
}
