import TextInput from "components/TextInput"
import { UserGroupResult } from "types/UserGroup"
import { Fieldset } from "components/Fieldset"
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
  userGroups?: UserGroupResult[]
  allGroups?: UserGroupResult[]
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
  userGroups,
  allGroups,
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

      <TextInput value={endorsedBy} name="endorsedBy" label="Endorsed by" width="20" />
      <TextInput value={orgServes} name="orgServes" label="Organisation" width="20" />

      <Fieldset>
        <legend>
          <h5 className="govuk-label">{"Group assignments"}</h5>
        </legend>
        <div className="govuk-checkboxes" data-module="govuk-checkboxes">
          {allGroups?.map((group: UserGroupResult) => (
            <div key={group.id} className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id={group.id}
                name={group.name}
                type="checkbox"
                value={userGroups && userGroups.length ? "yes" : "no"}
                defaultChecked={userGroups?.find((userGroup) => userGroup.id === group.id) !== undefined}
              />

              <label className="govuk-label govuk-checkboxes__label" htmlFor={group.id}>
                {group.name}
              </label>
            </div>
          ))}
        </div>
      </Fieldset>

      <TextInput value={endorsedBy} name="endorsedBy" label="Endorsed by" width="20" />
      <TextInput value={orgServes} name="orgServes" label="Organisation" width="20" />

      <MultiSelectCheckbox
        label="Show records from force"
        name="visibleForces"
        values={visibleForces}
        codes={listOfForces}
      />
      <TextInput
        value={visibleCourts}
        name="visibleCourts"
        label="Also, show records from specific Courts"
        width="20"
      />

      <MultiSelectCheckbox
        label="Exclude Triggers"
        name="excludedTriggers"
        values={excludedTriggers}
        codes={listOfTriggers}
      />
      <br />
    </>
  )
}

export default UserForm
