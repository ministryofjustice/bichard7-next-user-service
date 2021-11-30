import EmailContent from "types/EmailContent"
import UserDetails from "types/UserDetails"
import { UserGroupResult } from "types/UserGroup"

interface Props {
  url: string
  user: UserDetails
}

function printGroups(groups: UserGroupResult[]): string {
  let groupString = ""

  groups.forEach((group) => {
    groupString += `${group.name}, `
  })

  return groupString
}

const UserCreatedNotificationText = ({ url, user }: Props): string =>
  `This is an automated message notifying you of the following Bichard account creation.
  
           First name: ${user.forenames}
            Last name: ${user.surname}
                Email: ${user.emailAddress}
             Endorser: ${user.endorsedBy}
    Permissions Group: ${printGroups(user.groups)}
  
  ${url}
  `

export default function generateUserCreatedNotification(props: Props): EmailContent {
  return {
    subject: "Bichard: new user account created",
    html: "",
    text: UserCreatedNotificationText(props)
  }
}
