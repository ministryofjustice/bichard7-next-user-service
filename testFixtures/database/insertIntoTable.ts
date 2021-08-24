import getTestConnection from "../getTestConnection"

const insertIntoTable = async (data: any[]) => {
  const connection = getTestConnection()

  const insertQuery = `
    INSERT INTO 
      br7own.users(
        username, 
        active, 
        exclusion_list, 
        inclusion_list, 
        challenge_response, 
        created_at, 
        endorsed_by, 
        last_logged_in, 
        org_serves, 
        verify_attempts, 
        forenames, 
        surname, 
        email, 
        postal_address, 
        post_code, 
         phone_number, 
        old_password, 
        password, 
        last_login_attempt,
        deleted_at,
        password_reset_code
      ) VALUES (
        $\{username\},
        $\{active\},
        $\{exclusion_list\},
        $\{inclusion_list\},
        $\{challenge_response\},
        $\{created_at\},
        $\{endorsed_by\},
        $\{last_logged_in\},
        $\{org_serves\},
        $\{verify_attempts\},
        $\{forenames\},
        $\{surname\},
        $\{email\},
        $\{postal_address\},
        $\{post_code\},
        $\{phone_number\},
        $\{old_password\},
        $\{password\},
        $\{last_login_attempt\},
        $\{deleted_at},
        $\{password_reset_code\}
  )
  `

  const dataLen = data.length

  for (let i = 0; i < dataLen; i++) {
    await connection.none(insertQuery, { ...data[i] })
  }
}

export default insertIntoTable
