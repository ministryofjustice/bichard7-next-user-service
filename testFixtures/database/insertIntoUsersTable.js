import getTestConnection from "../getTestConnection"

const insertIntoUsersTable = async (data) => {
  const connection = getTestConnection()

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

  const queries = data.map((datum) => connection.none(insertQuery, { ...datum }))

  return Promise.all(queries)
}

export default insertIntoUsersTable
