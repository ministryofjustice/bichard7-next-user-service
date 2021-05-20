export interface User {
  emailAddress: string
  password: string
}

export interface AuthenticatedUser extends User {
  loggedIn: boolean
}

const devAccounts: [User] = [
  {
    emailAddress: "bichard01@example.com",
    password: "password"
  }
]

export const authenticate = (user: User): AuthenticatedUser => {
  const loggedIn =
    devAccounts.filter((u) => u.emailAddress === user.emailAddress && u.password === user.password).length > 0

  return {
    ...user,
    loggedIn
  }
}
