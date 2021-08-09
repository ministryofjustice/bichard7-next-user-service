import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import ButtonSecondary from "components/ButtonSecondary"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSideProps } from "next"
import { UserDetails } from "lib/User"
import parseFormData from "lib/parseFormData"
import Users from "../lib/Users"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let invalidUsername = false
  let invalidForename = false
  let invalidSurname = false
  let invalidPhonenumber = false
  let invalidEmailAddress = false
  let errorMessage = ""
  let successMessage = ""

  if (req.method === "POST") {
    const { username, forenames, surname, phoneNumber, emailAddress }: UserDetails = (await parseFormData(req)) as {
      username: string
      forenames: string
      surname: string
      phoneNumber: string
      emailAddress: string
    }

    if (username === "") {
      invalidUsername = true
    }
    if (forenames === "") {
      invalidForename = true
    }
    if (surname === "") {
      invalidSurname = true
    }
    if (phoneNumber === "") {
      invalidPhonenumber = true
    }
    if (emailAddress === "") {
      invalidEmailAddress = true
    }

    if (!(invalidUsername || invalidSurname || invalidForename || invalidPhonenumber || invalidEmailAddress)) {
      const result = await Users.create(username, forenames, surname, phoneNumber, emailAddress)
      errorMessage = result.error.message
      if (errorMessage === "") {
        successMessage = `User ${username} has ben successfully created`
      }
    } else {
      errorMessage = "Please make sure that all fields are non empty"
    }
  }
  return {
    props: { errorMessage, successMessage }
  }
}

interface Props {
  errorMessage: string
  successMessage: string
}

const newUser = ({ errorMessage, successMessage }: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout>
      <span id="event-name-error" className="govuk-error-message">
        {errorMessage}
      </span>
      {successMessage !== "" && <SuccessBanner message={successMessage} />}
      <form method="post">
        <TextInput id="username" name="username" label="Username" type="text" />
        <TextInput id="forenames" name="forenames" label="Forename(s)" type="text" />
        <TextInput id="surname" name="surname" label="Surname" type="text" />
        <TextInput id="phoneNumber" name="phoneNumber" label="Phone number" type="text" />
        <TextInput id="emailAddress" name="emailAddress" label="Email address" type="email" />

        <Button>{"Add user"}</Button>
      </form>

      <a href="/users">
        <ButtonSecondary> {"Back"} </ButtonSecondary>
      </a>
    </Layout>
  </>
)

export default newUser
