import pgPromise from 'pg-promise'
import { Tables } from './types'

export const getTableName = (tableName: Tables) => {
  const pgp = pgPromise()
  return new pgp.helpers.TableName({table: tableName, schema: 'br7own'})
}