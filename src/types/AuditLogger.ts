import type AuditLogEvent from "./AuditLogEvent"
import type KeyValuePair from "./KeyValuePair"
import type PromiseResult from "./PromiseResult"

type AuditLogger = (event: AuditLogEvent, attributes?: KeyValuePair<string, unknown>) => PromiseResult<void>

export default AuditLogger
