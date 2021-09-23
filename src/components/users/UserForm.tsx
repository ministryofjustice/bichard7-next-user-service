import TextInput from "components/TextInput"
import Select, { Option } from "components/Select"

interface Props {
  username?: string
  forenames?: string
  surname?: string
  emailAddress?: string
  endorsedBy?: string
  orgServes?: string
  groupId?: number
  userGroups?: Option[]
  usernameError?: string | false
  forenamesError?: string | false
  surnameError?: string | false
  emailError?: string | false
  isEdit?: boolean
}

const UserForm = ({
  username,
  forenames,
  surname,
  emailAddress,
  endorsedBy,
  orgServes,
  groupId,
  userGroups,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  isEdit = false
}: Props) => (
  <>
    <TextInput name="username" label="Username" error={usernameError} value={username} readOnly={isEdit} mandatory />
    <TextInput name="forenames" label="Forename(s)" error={forenamesError} value={forenames} mandatory />
    <TextInput name="surname" label="Surname" error={surnameError} value={surname} mandatory />
    <TextInput
      name="emailAddress"
      label="Email address"
      type="email"
      value={emailAddress}
      error={emailError}
      readOnly={isEdit}
      mandatory
    />

    <Select options={userGroups} label={"User role *"} id="groupId" defaultValue={groupId} />
    <TextInput value={endorsedBy} name="endorsedBy" label="Endorsed by" />
    <TextInput value={orgServes} name="orgServes" label="Organisation" />
  </>
)

export default UserForm
