import getTestConnection from "../getTestConnection"
import { getTableName } from "./helpers"

const selectFromTable = async (tableName, whereColumn, whereValue) => {
  const connection = getTestConnection()
  const isWhereClause = whereColumn && whereValue

  // eslint-disable-next-line no-useless-escape
  const selectQuery = `SELECT * FROM $\{table\} ${isWhereClause ? `WHERE ${whereColumn} = $\{value\}` : ""}`

  const table = getTableName(tableName)
  const whereClause = isWhereClause ? { value: whereValue } : {}

  return connection.any(selectQuery, { table, ...whereClause })
}

export default selectFromTable
