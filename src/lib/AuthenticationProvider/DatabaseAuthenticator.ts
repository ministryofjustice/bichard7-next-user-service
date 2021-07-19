import AuthenticationProvider from "lib/AuthenticationProvider"
import { AuthenticationResult } from "lib/AuthenticationResult"
import db from "lib/db"
import { compare } from "lib/shiro"
import { User, UserCredentials, UserGroup } from "lib/User"

export default class DatabaseAuthenticator extends AuthenticationProvider {
  public async authenticate(credentials: UserCredentials): Promise<AuthenticationResult> {
    const user = await this.fetchUser(credentials.emailAddress)
    const match = await compare(credentials.password, user.password)
    return match ? AuthenticationProvider.generateToken(user) : new Error("Invalid credentials")
  }

  private async fetchUser(emailAddress: string): Promise<User & UserCredentials> {
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
      LIMIT 1
    `

    const user = await db.oneOrNone(query, [emailAddress])

    if (!user) {
      throw new Error("Invalid credentials")
    }

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
      groups: await this.fetchGroupsForUser(emailAddress)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async fetchGroupsForUser(emailAddress: string): Promise<Array<UserGroup>> {
    const query = `
      SELECT g.name
      FROM br7own.groups g
      INNER JOIN br7own.users_groups ug
        ON g.id = ug.group_id
      INNER JOIN br7own.users u
        ON ug.user_id = u.id
      WHERE u.email = $1
    `

    let groups = await db.any(query, [emailAddress])

    // Remove the "_grp" suffix from group names
    // i.e. `B7Supervisor_grp` => `B7Supervisor`
    groups = groups.map((group) => group.name.replace(/_grp$/, ""))

    return groups
  }
}
