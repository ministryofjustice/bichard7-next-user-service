/* eslint-disable @typescript-eslint/no-explicit-any */
import TextInput from "components/TextInput"
import Select from "components/Select"

interface Props {
  username?: any
  forenames?: any
  surname?: any
  phoneNumber?: any
  postalAddress?: any
  emailAddress?: any
  postCode?: any
  endorsedBy?: any
  orgServes?: any
  groupId?: any
  missingUsername?: boolean
  missingForenames?: boolean
  missingSurname?: boolean
  missingPhoneNumber?: boolean
  missingEmail?: boolean
  disableEmailField?: boolean
  userGroups?: any
}

const UserForm = ({
  username,
  forenames,
  surname,
  phoneNumber,
  emailAddress,
  postalAddress,
  postCode,
  endorsedBy,
  orgServes,
  missingUsername,
  missingForenames,
  missingSurname,
  missingPhoneNumber,
  missingEmail,
  disableEmailField,
  groupId,
  userGroups
}: Props) => (
  <>
    <TextInput
      id="username"
      name="username"
      label="Username *"
      type="text"
      isError={missingUsername}
      defaultValue={username}
    />
    <TextInput
      id="forenames"
      name="forenames"
      label="Forename(s) *"
      type="text"
      isError={missingForenames}
      defaultValue={forenames}
    />
    <TextInput
      id="surname"
      name="surname"
      label="Surname *"
      type="text"
      isError={missingSurname}
      defaultValue={surname}
    />
    <TextInput
      id="phoneNumber"
      name="phoneNumber"
      label="Phone number *"
      type="text"
      isError={missingPhoneNumber}
      defaultValue={phoneNumber}
    />
    <TextInput
      id="emailAddress"
      name="emailAddress"
      label="Email address *"
      type="email"
      defaultValue={emailAddress}
      isError={missingEmail}
      disabled={disableEmailField}
    />

    <TextInput
      defaultValue={postalAddress}
      id="postalAddress"
      name="postalAddress"
      label="Postal address"
      type="text"
    />
    <Select options={userGroups} label={"User role *"} id="groupId" defaultValue={groupId} />
    <TextInput defaultValue={postCode} id="postCode" name="postCode" label="Postcode" type="text" />
    <TextInput defaultValue={endorsedBy} id="endorsedBy" name="endorsedBy" label="Endorsed by" type="text" />
    <TextInput defaultValue={orgServes} id="orgServes" name="orgServes" label="Organisation" type="text" />
  </>
)

export default UserForm
/* eslint-disable @typescript-eslint/no-explicit-any */
