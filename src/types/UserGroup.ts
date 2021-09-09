type UserGroup =
  | "B7Allocator"
  | "B7Audit"
  | "B7ExceptionHandler"
  | "B7GeneralHandler"
  | "B7Supervisor"
  | "B7TriggerHandler"

export type UserGroupResult = {
  id: string
  name: UserGroup
}

export default UserGroup
