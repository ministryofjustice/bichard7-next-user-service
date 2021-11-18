import TextInput from "components/TextInput"
import { UserGroupResult } from "types/UserGroup"
import forceInclusions from "codes/forceInclusions.json"
import triggersList from "codes/triggersList.json"
import React from "react"
import CheckboxMultiSelect from "components/CheckboxMultiSelect"

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

      <TextInput
        value={visibleCourts}
        name="visibleCourts"
        label="Also, show records from specific Courts"
        width="20"
      />
      <CheckboxMultiSelect
        idMappingFn={(item) => `visibleForces${item?.id}`}
        nameMappingFn={(item) => `visibleForces${item?.id}`}
        keymappingFn={(item) => `visibleForces${item?.id}`}
        displayValueMappingFn={(item) => `${item.id} - ${item.name}`}
        hintLabel="Show records from force"
        selectedOptions={visibleForces}
        allOptions={listOfForces}
      />
      <div className="govuk-checkboxes__divider" />
      <CheckboxMultiSelect
        idMappingFn={(item) => `excludedTriggers${item?.id}`}
        nameMappingFn={(item) => `excludedTriggers${item?.id}`}
        keymappingFn={(item) => `excludedTriggers${item?.id}`}
        displayValueMappingFn={(item) => `${item.id} - ${item.name}`}
        hintLabel="Included Triggers"
        selectedOptions={listOfTriggers.filter((x) => !excludedTriggers?.includes(x.id))}
        allOptions={listOfTriggers}
      />
      <div className="govuk-checkboxes__divider" />
      <div data-test="checkbox-user-groups">
        <CheckboxMultiSelect
          displayValueMappingFn={(item) => item.name}
          nameMappingFn={(item) => `${item?.name}`}
          idMappingFn={(item) => `${item?.id}`}
          keymappingFn={(item) => `${item?.id}`}
          allOptions={allGroups}
          hintLabel="Select groups that user belongs to"
          selectedOptions={userGroups}
        />
      </div>
      <br />
    </>
  )
}

export default UserForm
