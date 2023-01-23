export default class AuditLogEvent {
  private constructor(private code: string, private description: string) {}

  public static readonly loggedIn = new AuditLogEvent("user-logged-in", "User logged in")

  public static readonly changedPassword = new AuditLogEvent("user-password.changed", "Change password")

  public static readonly deletedUser = new AuditLogEvent("user-deletion.deleted", "Delete user")

  public static readonly resetPassword = new AuditLogEvent("user-password.reset", "Reset password")

  public static readonly createdUser = new AuditLogEvent("user-creation.created", "Create user")

  public static readonly failedCreatingNewEmailWhileCreatingUser = new AuditLogEvent(
    "user-creation.failed-email",
    "Error creating new user email"
  )

  public static readonly failedNotificationWhileCreatingUser = new AuditLogEvent(
    "user-creation.failed-notification",
    "Error sending notification email of new user creation"
  )

  public static readonly failedToEmailUserWhileCreatingUser = new AuditLogEvent(
    "user-creation.failed-emailing-user",
    "Error sending email to new user"
  )

  public static readonly editedUser = new AuditLogEvent("user-edit.updated", "Edit user")

  getCode() {
    return this.code
  }

  getDescription() {
    return this.description
  }

  toString() {
    return this.code
  }
}
