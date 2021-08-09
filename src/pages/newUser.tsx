import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import ButtonSecondary from "components/ButtonSecondary"

const newUser = () => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout>
      <form action="/" method="post">
        <TextInput id="username" name="username" label="Username" type="username" />
        <TextInput id="forenames" name="forenames" label="Forename(s)" type="forenames" />
        <TextInput id="surname" name="surname" label="Surname" type="surname" />
        <TextInput id="phoneNumber" name="phoneNumber" label="Phone number" type="phoneNumber" />
        <TextInput id="emailAddress" name="emailAddress" label="Email address" type="email" />

        <Button>{"Add user"}</Button>
      </form>

      <a href="/users">
        <ButtonSecondary> {"Cancel"} </ButtonSecondary>
      </a>
    </Layout>
  </>
)

export default newUser
