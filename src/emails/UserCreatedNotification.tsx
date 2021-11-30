import EmailContent from "types/EmailContent"
import UserDetails from "types/UserDetails"
import { UserGroupResult } from "types/UserGroup"

interface Props {
  user: UserDetails
}

function printGroups(groups: UserGroupResult[]): string {
  let groupString = ""

  groups.forEach((group) => {
    groupString += `${group.friendly_name}, `
  })

  const removeTrailingCommasAndSpaces = /,\s*$/

  return groupString.replace(removeTrailingCommasAndSpaces, "")
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
    html: "",
    text: UserCreatedNotificationText(props)
  }
}
