import getTestConnection from "../getTestConnection"
import { getTableName } from "./helpers"

const deleteFromTable = async (tableName, whereColumn, whereValue) => {
  const connection = getTestConnection()
  const isWhereClause = whereColumn && whereValue

  // eslint-disable-next-line no-useless-escape
  const deleteQuery = `DELETE FROM $\{table\} ${isWhereClause ? `WHERE ${whereColumn} = $\{value\}` : ""}`

  const table = getTableName(tableName)
  const whereClause = isWhereClause ? { column: whereColumn, value: whereValue } : {}

  return connection.none(deleteQuery, { table, ...whereClause })
}

export default deleteFromTable
