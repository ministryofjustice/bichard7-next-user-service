import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

const postFeedback = async (connection: Database, feedback: string, currentUserEmail: string): PromiseResult<void> => {
  const addFeedback = `
        INSERT INTO (email, feedback)
        VALUES()
    `

  const result = await connection.result(addFeedback, [feedback, currentUserEmail]).catch((error) => error)
  return result
}

export default postFeedback
