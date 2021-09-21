import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

const removeJwt = async (connection: Database, uniqueId: string): PromiseResult<void> => {
  /* eslint-disable no-useless-escape */
  const removeJwtQuery = `
    DELETE FROM br7own.jwt_ids
    WHERE id = $\{id\};
  `
  /* eslint-disable no-useless-escape */

  try {
    await connection.none(removeJwtQuery, { id: uniqueId })
    return undefined
  } catch (error) {
    return error as Error
  }
}

export default removeJwt
