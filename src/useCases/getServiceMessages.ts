import config from "lib/config"
import Database from "types/Database"
import PaginatedResult from "types/PaginatedResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"

export default async (connection: Database, page: number): PromiseResult<PaginatedResult<ServiceMessage[]>> => {
  const serviceMessagesQuery = `
  SELECT 
    id, 
    message, 
    created_at AS "createdAt",
    COUNT(*) OVER() AS "allMessages"
  FROM 
    br7own.service_messages
  ORDER BY created_at DESC
    OFFSET ${page * config.maxServiceMessagesPerPage} ROWS
    FETCH NEXT ${config.maxServiceMessagesPerPage} ROWS ONLY
  `

  const serviceMessages = await connection.manyOrNone(serviceMessagesQuery).catch((error) => error as Error)

  if (isError(serviceMessages)) {
    return serviceMessages
  }

  const result = (serviceMessages || []) as ServiceMessage[]
  const totalElements = parseInt(serviceMessages[0]?.allMessages || 0, 10)

  return { result, totalElements }
}
