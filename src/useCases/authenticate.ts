import { ITask } from "pg-promise"
import UserGroup from "types/UserGroup"
import config from "lib/config"
import Database from "types/Database"
import AuditLogger from "types/AuditLogger"
import { verifySsha } from "lib/ssha"
import { verifyPassword } from "lib/argon2"
import PromiseResult from "types/PromiseResult"
import User from "types/User"
import resetUserVerificationCode from "./resetUserVerificationCode"
import updatePassword from "./updatePassword"

const fetchGroups = async (task: ITask<unknown>, emailAddress: string): Promise<UserGroup[]> => {
  const fetchGroupsQuery = `
      SELECT g.name
      FROM br7own.groups g
      INNER JOIN br7own.users_groups ug
        ON g.id = ug.group_id
      INNER JOIN br7own.users u
        ON ug.user_id = u.id
      WHERE u.email = $1 AND u.deleted_at IS NULL
    `
  let groups = await task.any(fetchGroupsQuery, [emailAddress])
  groups = groups.map((group: { name: string }) => group.name.replace(/_grp$/, ""))
  return groups
}

const getUserWithInterval = async (task: ITask<unknown>, params: unknown[]) => {
  const getUserQuery = `
  SELECT
    id,
    username,
    exclusion_list,
    inclusion_list,
    endorsed_by,
    org_serves,
    forenames,
    surname,
    email,
    password,
    email_verification_code,
    migrated_password
  FROM br7own.users
  WHERE email = $1
    AND last_login_attempt < NOW() - INTERVAL '$2 seconds'
    AND deleted_at IS NULL`

  const user = await task.one(getUserQuery, params)

  return {
    id: user.id,
    username: user.username,
    exclusionList: user.exclusion_list.split(/[, ]/),
    inclusionList: user.inclusion_list.split(/[, ]/),
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    forenames: user.forenames,
    surname: user.surname,
    emailAddress: user.email,
    password: user.password,
    emailVerificationCode: user.email_verification_code,
    migratedPassword: user.migrated_password,
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

const authenticate = async (
  connection: Database,
  auditLogger: AuditLogger,
  emailAddress: string,
  password: string,
  verificationCode: string
): PromiseResult<User> => {
  const invalidCredentialsError = new Error("Invalid credentials or invalid verification")

  if (!emailAddress || !password || !verificationCode || verificationCode.length !== config.verificationCodeLength) {
    return invalidCredentialsError
  }

  try {
    const user = await connection.tx(async (task: ITask<unknown>) => {
      const u = await getUserWithInterval(task, [emailAddress, config.incorrectDelay])
      await updateUserLoginTimestamp(task, emailAddress)
      return u
    })

    let isAuthenticated = false

    if (!user.password && user.migratedPassword) {
      isAuthenticated = verifySsha(password, user.migratedPassword)

      if (isAuthenticated) {
        await updatePassword(connection, user.emailAddress, password)
      }
    } else {
      isAuthenticated = await verifyPassword(password, user.password)
    }

    const isVerified = verificationCode === user.emailVerificationCode

    if (isAuthenticated && isVerified) {
      await resetUserVerificationCode(connection, emailAddress)
      await auditLogger("User logged in", { user: { ...user, password: undefined } })
      return user
    }

    return invalidCredentialsError
  } catch (error) {
    return error
  }
}

export default authenticate
