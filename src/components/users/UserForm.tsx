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

export const listOfForces = forceInclusions
  .map((x: { Code: string; Name: string }) => {
    return { id: x.Code, name: x.Name }
  })
  .filter((x: { id: string; name: string }) => x.id[0] !== "B" && x.id[0] !== "C")
  .sort((x: { id: string; name: string }, y: { id: string; name: string }) => (x.id > y.id ? 1 : -1))
export const listOfTriggers = triggersList.map((x: { Code: string; Description: string }) => {
  return { id: x.Code, name: x.Description }
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

      <div className="govuk-details__text">
        <MultiSelectCheckbox
          label="Show records from force"
          name="visibleForces"
          values={visibleForces}
          codes={listOfForces}
        />
      </div>
      <TextInput
        value={visibleCourts}
        name="visibleCourts"
        label="Also, show records from specific Courts"
        width="20"
      />

      <div className="govuk-details__text">
        <MultiSelectCheckbox
          label="Exclude Triggers"
          name="excludedTriggers"
          values={excludedTriggers}
          codes={listOfTriggers}
        />
      </div>
      <br />
    </>
  )
}

export default UserForm
