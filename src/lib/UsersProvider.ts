import { ListUsersResult } from "lib/UsersResult"

export default interface UsersProvider {
  list(): Promise<ListUsersResult>
}
