import jwt from "jsonwebtoken"
import { AuthenticationResult } from "lib/AuthenticationResult"
import config from "lib/config"
import db from "lib/db"
import { compare } from "lib/shiro"
import { Token, TokenPayload } from "lib/Token"
import { User, UserCredentials, UserGroup } from "lib/User"
import type { ITask } from "pg-promise"

export default class Authenticator {
  public static async authenticate(credentials: UserCredentials): Promise<AuthenticationResult> {
    const error = new Error("Invalid credentials")

    try {
      const user = await db.tx(async (task: ITask<unknown>) => {
        const u = await Authenticator.fetchUser(task, credentials.emailAddress)
        await Authenticator.updateUserLoginTimestamp(task, credentials.emailAddress)
        return u
      })

      const match = await compare(credentials.password, user.password)
      return match ? Authenticator.generateToken(user) : error
    } catch {
      return error
    }
  }

  private static async fetchGroups(task: ITask<unknown>, emailAddress: string): Promise<UserGroup[]> {
    const query = `
      SELECT g.name
      FROM br7own.groups g
      INNER JOIN br7own.users_groups ug
        ON g.id = ug.group_id
      INNER JOIN br7own.users u
        ON ug.user_id = u.id
      WHERE u.email = $1
    `

    let groups = await task.any(query, [emailAddress])

    // Remove the "_grp" suffix from group names
    // i.e. `B7Supervisor_grp` => `B7Supervisor`
    groups = groups.map((group: { name: string }) => group.name.replace(/_grp$/, ""))

    return groups
  }

  private static async fetchUser(task: ITask<unknown>, emailAddress: string): Promise<User & UserCredentials> {
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

    const user = await task.one(query, [emailAddress, config.incorrectDelay])

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
      groups: await Authenticator.fetchGroups(task, emailAddress)
    }
  }

  private static async updateUserLoginTimestamp(task: ITask<unknown>, emailAddress: string) {
    const query = `
      UPDATE br7own.users
      SET last_login_attempt = NOW()
      WHERE email = $1
    `

    await task.none(query, [emailAddress])
  }

  private static generateToken(user: User): Token {
    const payload: TokenPayload = {
      username: user.username,
      exclusionList: user.exclusionList,
      inclusionList: user.inclusionList,
      forenames: user.forenames,
      surname: user.surname,
      emailAddress: user.emailAddress,
      groups: user.groups
    }

    const options: jwt.SignOptions = {
      expiresIn: config.tokenExpiresIn,
      issuer: config.tokenIssuer
    }

    return jwt.sign(payload, config.tokenSecret, options)
  }
}
