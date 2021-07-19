import { AllUsersResult } from "lib/UsersResult"

export default interface UsersProvider {
  list(): AllUsersResult
}
