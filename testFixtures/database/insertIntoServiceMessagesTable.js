import getTestConnection from "../getTestConnection"

const insertIntoServiceMessagesTable = async (data) => {
  const connection = getTestConnection()

  /* eslint-disable no-useless-escape */
  const insertQuery = `
    INSERT INTO 
      br7own.service_messages(
        message,
        created_at
      ) VALUES (
        $\{message\}
        $\{created_at\}
      )
  `
  /* eslint-disable no-useless-escape */

  const dataLen = data.length

  /* eslint-disable */
  for (let i = 0; i < dataLen; i++) {
    await connection.none(insertQuery, { ...data[i] })
  }
  /* eslint-disable */

  return Promise.resolve()
}

export default insertIntoServiceMessagesTable
