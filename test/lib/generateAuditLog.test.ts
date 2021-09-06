import generateAuditLog from "lib/generateAuditLog"
import { GetServerSidePropsContext } from "next"
import User from "types/User"

const dummyRequest = { socket: { remoteAddress: "dummyRemoteAddress" }, url: "/dummyUrl" }

it("should generate audit log when current user exists", () => {
  const user = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as User

  const testContext = { currentUser: user, req: dummyRequest } as unknown as GetServerSidePropsContext
  const auditLog = generateAuditLog(testContext, "Dummy action", { attribute1: "test", attribute2: true })

  expect(auditLog.auditLogId).toBeDefined()
  expect(auditLog.timestamp).toBeDefined()
  expect(auditLog.action).toBe("Dummy action")
  expect(auditLog.requestUri).toBe(dummyRequest.url)
  expect(auditLog.userIp).toBe(dummyRequest.socket.remoteAddress)
  expect(auditLog.username).toBe(user.username)
  expect(auditLog.attributes).toBeDefined()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { attribute1, attribute2 } = auditLog.attributes!
  expect(attribute1).toBe("test")
  expect(attribute2).toBe(true)
})

it("should generate audit log when current user does not exist", () => {
  const testContext = { req: dummyRequest } as unknown as GetServerSidePropsContext
  const auditLog = generateAuditLog(testContext, "Dummy action", { attribute1: "test", attribute2: true })

  expect(auditLog.auditLogId).toBeDefined()
  expect(auditLog.timestamp).toBeDefined()
  expect(auditLog.action).toBe("Dummy action")
  expect(auditLog.requestUri).toBe(dummyRequest.url)
  expect(auditLog.userIp).toBe(dummyRequest.socket.remoteAddress)
  expect(auditLog.username).toBe("Anonymous")
  expect(auditLog.attributes).toBeDefined()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { attribute1, attribute2 } = auditLog.attributes!
  expect(attribute1).toBe("test")
  expect(attribute2).toBe(true)
})
