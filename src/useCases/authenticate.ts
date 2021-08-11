import { ITask } from "pg-promise"
import UserGroup from "types/UserGroup"
import { compare } from "lib/shiro"
import config from "lib/config"

const fetchGroups = async (task: ITask<unknown>, emailAddress: string): Promise<UserGroup[]> => {
  const fetchGroupsQuery = `
      SELECT g.name
      FROM br7own.groups g
      INNER JOIN br7own.users_groups ug
        ON g.id = ug.group_id
      INNER JOIN br7own.users u
        ON ug.user_id = u.id
      WHERE u.email = $1
    `
  let groups = await task.any(fetchGroupsQuery, [emailAddress])
  groups = groups.map((group: { name: string }) => group.name.replace(/_grp$/, ""))
  return groups
}

const getUserWithInterval = async (task: ITask<unknown>, params: any[]) => {
  const getUserQuery = `
  SELECT
    username,
    exclusion_list,
    inclusion_list,
    endorsed_by,
    org_serves,
    forenames,
    surname,
    postal_address,
    post_code,
    email,
    phone_number,
    password,
    email_verification_code
  FROM br7own.users
  WHERE email = $1
    AND last_login_attempt < NOW() - INTERVAL '$2 seconds'`

  const user = await task.one(getUserQuery, params)

  return {
    username: user.username,
    exclusionList: user.exclusion_list.split(/[, ]/),
    inclusionList: user.inclusion_list.split(/[, ]/),
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    forenames: user.forenames,
    surname: user.surname,
    emailAddress: user.email,
    postalAddress: user.postal_address,
    postCode: user.post_code,
    phoneNumber: user.phone_number,
    password: user.password,
    emailVerificationCode: user.email_verification_code,
    groups: await fetchGroups(task, user.email)
  }
}

const updateUserLoginTimestamp = async (task: ITask<unknown>, emailAddress: string) => {
  const updateUserQuery = `
      UPDATE br7own.users
      SET last_login_attempt = NOW()
      WHERE email = $1
    `

  await task.none(updateUserQuery, [emailAddress])
}

const authenticate = async (connection: any, emailAddress: string, password: string, verificationCode: string) => {
  const invalidCredentialsError = new Error("Invalid credentials or invalid verification")

  if (!emailAddress || !password || !verificationCode) {
    return new Error()
  }

  try {
    const user = await connection.tx(async (task: ITask<unknown>) => {
      const u = await getUserWithInterval(task, [emailAddress, config.incorrectDelay])
      await updateUserLoginTimestamp(task, emailAddress)
      return u
    })

    const isAuthenticated = await compare(password, user.password)
    const isVerified = verificationCode === user.emailVerificationCode

    if (isAuthenticated && isVerified) {
      return user
    }
    return invalidCredentialsError
  } catch (error) {
    return error
  }
}

export default authenticate
