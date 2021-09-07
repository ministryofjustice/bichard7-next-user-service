/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import AuditLogger from "types/AuditLogger"

const fakeAuditLogger: AuditLogger = (_action, _attributes) => {
  return Promise.resolve()
}

export default fakeAuditLogger
