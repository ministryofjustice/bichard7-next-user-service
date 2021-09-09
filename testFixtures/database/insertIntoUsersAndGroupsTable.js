import getTestConnection from "../getTestConnection"
import insertIntoGroupsTable from "./insertIntoGroupsTable"
import insertIntoUsersTable from "./insertIntoUsersTable"

const randomlySelectGroupId = (groups) => {
  const max = groups.length - 1
  return groups[Math.round(Math.random() * max)].id
}

const insertIntoUsersAndGroupsTable = async (users, groups) => {
  const connection = getTestConnection()

  await insertIntoUsersTable(users)
  await insertIntoGroupsTable(groups)

  const selectFromGroupsQuery = "SELECT id FROM br7own.groups"
  const selectFromUsersQuery = "SELECT id FROM br7own.users"

  const selectedGroups = await connection.any(selectFromGroupsQuery)
  const selectedUsers = await connection.any(selectFromUsersQuery)

  /* eslint-disable no-useless-escape */
  const insertQuery = `
    INSERT INTO 
      br7own.users_groups(
        group_id, 
        user_id
      ) VALUES (
        $\{group_id\},
        $\{user_id\}
      )
  `
  /* eslint-disable no-useless-escape */

  const usersLen = users.length

  /* eslint-disable */
  for (let i = 0; i < usersLen; i++) {
    await connection.none(insertQuery, { group_id: randomlySelectGroupId(selectedGroups), user_id: selectedUsers[i].id })
  }
  /* eslint-disable */

  return Promise.resolve()
}

export default insertIntoUsersAndGroupsTable
