import getTestConnection from "../getTestConnection"

const insertIntoGroupTable = async (data) => {
  const connection = getTestConnection()

  const insertQuery = `
    INSERT INTO
      br7own.groups(
        name
      ) VALUES (
        $\{name\}
      )
  `

  const queries = data.map((datum) => connection.none(insertQuery, { ...datum }))

  return Promise.all(queries)
}

export default insertIntoGroupTable
