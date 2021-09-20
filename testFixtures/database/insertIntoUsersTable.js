import getTestConnection from "../getTestConnection"

const insertIntoUsersTable = async (data) => {
  const connection = getTestConnection()

  /* eslint-disable no-useless-escape */
  const insertQuery = `
    INSERT INTO 
      br7own.users(
        username, 
        exclusion_list, 
        inclusion_list, 
        created_at, 
        endorsed_by, 
        last_logged_in, 
        org_serves, 
        forenames, 
        surname, 
        email, 
        password, 
        last_login_attempt,
        deleted_at,
        password_reset_code,
        migrated_password
      ) VALUES (
        $\{username\},
        $\{exclusion_list\},
        $\{inclusion_list\},
        $\{created_at\},
        $\{endorsed_by\},
        $\{last_logged_in\},
        $\{org_serves\},
        $\{forenames\},
        $\{surname\},
        $\{email\},
        $\{password\},
        $\{last_login_attempt\},
        $\{deleted_at},
        $\{password_reset_code\},
        $\{migrated_password\}
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

export default insertIntoUsersTable
