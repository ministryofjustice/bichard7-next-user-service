const getConnection = require("../connection")

const createUsers = async () => {
  const connection = getConnection()

  const deleteUsersGroups = `
    DELETE FROM br7own.users_groups
  `

  await connection.none(deleteUsersGroups)

  const deleteAllUsersQuery = `
    DELETE FROM br7own.users
  `

  await connection.none(deleteAllUsersQuery)

  const seedUsersTableQuery = `
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
        last_login_attempt
      )
      VALUES (
        'Bichard01', 
        true, 
        '1, 2, 3, 4', 
        '5, 6, 7, 8', 
        'challenge response', 
        '2021-08-01 00:00:00-00', 
        'endorsed_by 01', 
        '2021-08-01 00:00:00-00', 
        'org_servers', 
        '1', 
        'Bichard User 01', 
        'Surname 01', 
        'bichard01@example.com', 
        'address 01', 
        'SE1 0EF', 
        '0800 111 222', 
        'password', 
        '$shiro1$SHA-256$500000$sL5A3oRuVXTJCy36WP5Kyg==$ggXBhVWqFN35dRW/TXWO7Dm/zEwWxNu4CuwXNvEJ8Jw=', 
        '2021-08-01 00:00:00-00'
      ),
      (
        'Bichard02', 
        true, 
        '10, 20, 30, 40', 
        '50, 60, 70, 80', 
        'challenge response 02', 
        '2021-08-02 00:00:00-00', 
        'endorsed_by 02', 
        '2021-08-02 00:00:00-00', 
        'org_servers 02', 
        '2', 
        'Bichard User 02', 
        'Surname 02', 
        'bichard02@example.com', 
        'address 02', 
        'SE2 1EF', 
        '0800 222 333', 
        'password', 
        '$shiro1$SHA-256$500000$sL5A3oRuVXTJCy36WP5Kyg==$ggXBhVWqFN35dRW/TXWO7Dm/zEwWxNu4CuwXNvEJ8Jw=', 
        '2021-08-02 00:00:00-00'
      ),
      (
        'Bichard03', 
        true, 
        '100, 200, 300, 400', 
        '500, 600, 700, 800', 
        'challenge response 3', 
        '2021-08-03 00:00:00-00', 
        'endorsed_by 03', 
        '2021-08-03 00:00:00-00', 
        'org_servers 03', 
        '3', 
        'Bichard User 03', 
        'Surname 03', 
        'bichard03@example.com', 
        'address 03', 
        'SE1 0EF', 
        '0800 333 444', 
        'password', 
        '$shiro1$SHA-256$500000$sL5A3oRuVXTJCy36WP5Kyg==$ggXBhVWqFN35dRW/TXWO7Dm/zEwWxNu4CuwXNvEJ8Jw=', 
        '2021-08-03 00:00:00-00'
      );
  `
  // eslint-disable-next-line no-return-await
  return await connection.none(seedUsersTableQuery)
}

module.exports = createUsers
