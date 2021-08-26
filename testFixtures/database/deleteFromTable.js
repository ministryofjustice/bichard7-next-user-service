import getTestConnection from "../getTestConnection"
import { getTableName } from "./helpers"

const deleteFromTable = async (tableName, whereColumn, whereValue) => {
  const connection = getTestConnection()
  const isWhereClause = whereColumn && whereValue

  /* eslint-disable no-useless-escape */
  const deleteQuery = `DELETE FROM br7own.users_groups; DELETE FROM $\{table\} ${
    isWhereClause ? `WHERE ${whereColumn} = $\{value\}` : ""
  }`
  /* eslint-disable no-useless-escape */

  const table = getTableName(tableName)
  const whereClause = isWhereClause ? { column: whereColumn, value: whereValue } : {}

  return connection.none(deleteQuery, { table, ...whereClause })
}

export default deleteFromTable
