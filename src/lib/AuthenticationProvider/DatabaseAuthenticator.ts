import AuthenticationProvider from "lib/AuthenticationProvider"
import { AuthenticationResult } from "lib/AuthenticationResult"
import config from "lib/config"
import { compare } from "lib/shiro"
import { User, UserCredentials, UserGroup } from "lib/User"
import { Client } from "pg"

export default class DatabaseAuthenticator extends AuthenticationProvider {
  private dbClient: Client

  constructor() {
    super()
    this.dbClient = new Client({
      user: config.databaseAuthenticator.dbUser,
      host: config.databaseAuthenticator.dbHost,
      database: config.databaseAuthenticator.dbDatabase,
      password: config.databaseAuthenticator.dbPassword,
      port: config.databaseAuthenticator.dbPort,
      ssl: config.databaseAuthenticator.dbSsl ? { rejectUnauthorized: false } : false
    })
    this.dbClient.connect()
  }

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

    const res = await this.dbClient.query(query, [emailAddress])
    const user = res.rows[0]

    return {
      username: user.username,
      exclusionList: user.exclusion_list,
      inclusionList: user.inclusion_list,
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

    const res = await this.dbClient.query(query, [emailAddress])
    const groups = res.rows.map((row) => row.name)

    return groups
  }
}
