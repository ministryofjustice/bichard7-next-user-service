import getTestConnection from "../getTestConnection"

const insertIntoServiceMessagesTable = (data) => {
  const connection = getTestConnection()

  /* eslint-disable no-useless-escape */
  const insertQuery = `
    INSERT INTO 
      br7own.service_messages(
        message,
        created_at
      ) VALUES (
        $\{message\},
        $\{created_at\}
      )
  `

  return Promise.allSettled(data.map((item) => connection.none(insertQuery, { ...item })))
}

export default insertIntoServiceMessagesTable
