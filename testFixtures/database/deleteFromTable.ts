import getTestConnection from "../getTestConnection"
import { Tables } from "./types"
import { getTableName, getWhereClause } from "./helpers"

const deleteFromTable = async (tableName: Tables, whereColumn?: string, whereValue?: string) => {
  const connection = getTestConnection()
  const isWhereClause = whereColumn && whereValue

  const deleteQuery = `
    DELETE FROM $\{table\}
    ${isWhereClause ? getWhereClause() : ""}
  `

  const table = getTableName(tableName)
  const whereClause = isWhereClause ? { column: whereColumn, value: whereValue } : {}

  return connection.none(deleteQuery, { table, ...whereClause })
}

export default deleteFromTable
