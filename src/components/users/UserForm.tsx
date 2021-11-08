import TextInput from "components/TextInput"
import { UserGroupResult } from "types/UserGroup"
import { Fieldset } from "components/Fieldset"

interface Props {
  username?: string
  forenames?: string
  surname?: string
  emailAddress?: string
  endorsedBy?: string
  orgServes?: string
  userGroups?: UserGroupResult[]
  allGroups?: UserGroupResult[]
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
  userGroups,
  allGroups,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  isEdit = false
}: Props) => (
  <>
    <TextInput
      name="username"
      label="Username"
      error={usernameError}
      value={username}
      readOnly={isEdit}
      width="20"
      mandatory
    />
    <TextInput name="forenames" label="Forename(s)" error={forenamesError} value={forenames} width="20" mandatory />
    <TextInput name="surname" label="Surname" error={surnameError} value={surname} width="20" mandatory />
    <TextInput
      name="emailAddress"
      label="Email address"
      type="email"
      value={emailAddress}
      error={emailError}
      readOnly={isEdit}
      width="20"
      mandatory
    />

    <Fieldset>
      <legend><label className="govuk-label">{"Group assignments"}</label></legend>
      <div className="govuk-checkboxes" data-module="govuk-checkboxes">
        {allGroups?.map((group: UserGroupResult) => (
          <div key={group.id} className="govuk-checkboxes__item">
            <input className="govuk-checkboxes__input" id={group.id} name={group.name} type="checkbox" value={userGroups && userGroups.length ? "yes" : "no"} defaultChecked={ userGroups?.find(userGroup => userGroup.id === group.id) !== undefined } />

            <label className="govuk-label govuk-checkboxes__label" htmlFor={group.id}>
              {group.name}
            </label>
          </div>
        ))}
      </div>
    </Fieldset>

    <TextInput value={endorsedBy} name="endorsedBy" label="Endorsed by" width="20" />
    <TextInput value={orgServes} name="orgServes" label="Organisation" width="20" />
  </>
)

export default UserForm
