import TextInput from "components/TextInput"
import Select, { Option } from "components/Select"
import MultiSelectCheckbox from "components/MultiSelectCheckbox"
import forceInclusions from "codes/forceInclusions.json"
import triggersList from "codes/triggersList.json"

interface Props {
  username?: string
  forenames?: string
  surname?: string
  emailAddress?: string
  endorsedBy?: string
  orgServes?: string
  groupId?: number
  userGroups?: Option[]
  visibleForces?: string
  visibleCourts?: string
  excludedTriggers?: string
  usernameError?: string | false
  forenamesError?: string | false
  surnameError?: string | false
  emailError?: string | false
  isEdit?: boolean
}
/* eslint-disable @typescript-eslint/no-explicit-any */

export const listOfForces = Object.keys(forceInclusions)
  .map((x: any) => {
    return { id: x, name: forceInclusions[x].Name }
  })
  .filter((x) => x.id[0] !== "B" && x.id[0] !== "C")
  .sort((x, y) => (x.id > y.id ? 1 : -1))
export const listOfTriggers = Object.keys(triggersList).map((x: any) => {
  return { id: x, name: triggersList[x] }
})

const UserForm = ({
  username,
  forenames,
  surname,
  emailAddress,
  endorsedBy,
  orgServes,
  groupId,
  userGroups,
  visibleForces,
  visibleCourts,
  excludedTriggers,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  isEdit = false
}: Props) => {
  return (
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

      <Select options={userGroups} label={"User role *"} id="groupId" defaultValue={groupId} />
      <TextInput value={endorsedBy} name="endorsedBy" label="Endorsed by" width="20" />
      <TextInput value={orgServes} name="orgServes" label="Organisation" width="20" />

      <details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{"Show records from force"}</span>
        </summary>
        <div className="govuk-details__text">
          <MultiSelectCheckbox name="visibleForces" values={visibleForces} codes={listOfForces} />
        </div>
      </details>
      <TextInput
        value={visibleCourts}
        name="visibleCourts"
        label="Also, show records from specific Courts"
        width="20"
      />

      <details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{"Display Triggers"}</span>
        </summary>
        <div className="govuk-details__text">
          <MultiSelectCheckbox name="excludedTriggers" values={excludedTriggers} codes={listOfTriggers} />
        </div>
      </details>
    </>
  )
}

export default UserForm
