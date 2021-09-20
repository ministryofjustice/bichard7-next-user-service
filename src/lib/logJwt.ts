import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

const logJwt = async (connection: Database, userId: number, uniqueId: string): PromiseResult<void> => {
  /* eslint-disable no-useless-escape */
  const logJwtQuery = `
    INSERT INTO br7own.jwt_ids
    (
      id,
      generated_at, 
      user_id
    )
    VALUES 
    (
      $\{id}, 
      NOW(), 
      $\{user_id\}
    );
  `
  /* eslint-disable no-useless-escape */

  try {
    await connection.none(logJwtQuery, { id: uniqueId, user_id: userId })
    return undefined
  } catch (error) {
    return error as Error
  }
}

export default logJwt
