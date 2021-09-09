import getTestConnection from "../getTestConnection"

const insertIntoGroupTable = async (data) => {
  const connection = getTestConnection()

  /* eslint-disable no-useless-escape */
  const insertQuery = `
    INSERT INTO 
      br7own.groups(
        name
      ) VALUES (
        $\{name\}
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

export default insertIntoGroupTable
