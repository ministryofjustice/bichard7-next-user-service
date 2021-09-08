import KeyValuePair from "./KeyValuePair"
import PromiseResult from "./PromiseResult"

type AuditLogger = (action: string, attributes?: KeyValuePair<string, unknown>) => PromiseResult<void>

export default AuditLogger
