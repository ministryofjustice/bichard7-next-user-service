import getTestConnection from "../getTestConnection"
import { Tables } from "./types"
import { getTableName, getWhereClause } from "./helpers"

const selectFromTable = async (tableName: Tables, whereColumn?: string, whereValue?: string) => {
  const connection = getTestConnection()
  const isWhereClause = whereColumn && whereValue

  const selectQuery = `
    SELECT * FROM $\{table\}
    ${isWhereClause ? getWhereClause(whereColumn as string) : ""}
  `

  const table = getTableName(tableName)
  const whereClause = isWhereClause ? { value: whereValue } : {}

  return connection.any(selectQuery, { table, ...whereClause })
}

export default selectFromTable
