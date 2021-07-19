import AuthenticationProvider from "lib/AuthenticationProvider"
import { AuthenticationResult } from "lib/AuthenticationResult"
import config from "lib/config"
import db from "lib/db"
import { compare } from "lib/shiro"
import { User, UserCredentials, UserGroup } from "lib/User"
import type { ITask } from "pg-promise"

async function fetchGroups(t: ITask<unknown>, emailAddress: string): Promise<UserGroup[]> {
  const query = `
    SELECT g.name
    FROM br7own.groups g
    INNER JOIN br7own.users_groups ug
      ON g.id = ug.group_id
    INNER JOIN br7own.users u
      ON ug.user_id = u.id
    WHERE u.email = $1
  `

  let groups = await t.any(query, [emailAddress])

  // Remove the "_grp" suffix from group names
  // i.e. `B7Supervisor_grp` => `B7Supervisor`
  groups = groups.map((group) => group.name.replace(/_grp$/, ""))

  return groups
}

async function fetchUser(t: ITask<unknown>, emailAddress: string): Promise<User & UserCredentials> {
  const query = `
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
      phone_number,
      password
    FROM br7own.users
    WHERE email = $1
      AND last_login_attempt < NOW() - INTERVAL '$2 seconds'
  `

  const user = await t.one(query, [emailAddress, config.incorrectDelay])

  return {
    username: user.username,
    exclusionList: user.exclusion_list.split(/[, ]/),
    inclusionList: user.inclusion_list.split(/[, ]/),
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    forenames: user.forenames,
    surname: user.surname,
    emailAddress,
    postalAddress: user.postal_address,
    postCode: user.post_code,
    phoneNumber: user.phone_number,
    password: user.password,
    groups: await fetchGroups(t, emailAddress)
  }
}

async function updateUserLoginTimestamp(t: ITask<unknown>, emailAddress: string) {
  const query = `
    UPDATE br7own.users
    SET last_login_attempt = NOW()
    WHERE email = $1
  `

  await t.none(query, [emailAddress])
}

export default class DatabaseAuthenticator extends AuthenticationProvider {
  // eslint-disable-next-line class-methods-use-this
  public async authenticate(credentials: UserCredentials): Promise<AuthenticationResult> {
    const error = new Error("Invalid credentials")

    try {
      const user = await db.tx(async (t) => {
        const u = await fetchUser(t, credentials.emailAddress)
        await updateUserLoginTimestamp(t, credentials.emailAddress)
        return u
      })

      const match = await compare(credentials.password, user.password)
      return match ? AuthenticationProvider.generateToken(user) : error
    } catch {
      return error
    }
  }
}
