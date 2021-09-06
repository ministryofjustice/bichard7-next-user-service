import { randomUUID } from "crypto"
import KeyValuePair from "./KeyValuePair"

export default class AuditLog {
  public readonly auditLogId: string

  public readonly timestamp: Date

  constructor(
    public readonly action: string,
    public readonly username: string,
    public readonly userIp: string,
    public readonly requestUri: string,
    public readonly attributes?: KeyValuePair<string, unknown>
  ) {
    this.auditLogId = randomUUID()
    this.timestamp = new Date()
  }
}
