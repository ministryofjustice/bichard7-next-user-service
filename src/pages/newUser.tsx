import TextInput from "components/TextInput"

const newUser = () => {
  ;<>
    <TextInput id="username" name="username" label="Username" type="username" />
    <TextInput id="forenames" name="forenames" label="Forename(s)" type="forenames" />
    <TextInput id="surname" name="surname" label="Surname" type="surname" />
    <TextInput id="phoneNumber" name="phoneNumber" label="Phone number" type="phoneNumber" />
    <TextInput id="emailAddress" name="emailAddress" label="Email address" type="email" />
  </>
}

export default newUser
