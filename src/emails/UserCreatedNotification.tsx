import EmailContent from "types/EmailContent"
import UserDetails from "types/UserDetails"
import { UserGroupResult } from "types/UserGroup"

interface Props {
  user: UserDetails
}

function printGroups(groups: UserGroupResult[]): string {
  return groups
    .map((group: UserGroupResult) => group.friendly_name)
    .join(", ")
    .trimEnd()
}

const UserCreatedNotificationText = ({ user }: Props): string =>
  `This is an automated message notifying you of the following Bichard account creation.
  
            First name: ${user.forenames}
             Last name: ${user.surname}
                 Email: ${user.emailAddress}
              Endorser: ${user.endorsedBy}
    Permissions Groups: ${printGroups(user.groups)}
  `

export default function generateUserCreatedNotification(props: Props): EmailContent {
  return {
    subject: "Bichard: new user account created",
    text: UserCreatedNotificationText(props)
  }
}
