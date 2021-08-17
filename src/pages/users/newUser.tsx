import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSideProps } from "next"
import UserCreateDetails from "types/UserCreateDetails"
import getConnection from "lib/getConnection"
import parseFormData from "lib/parseFormData"
import setupNewUser from "useCases/setupNewUser"
import { isError } from "types/Result"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let missingMandatory = false
  let errorMessage = ""

  if (req.method === "POST") {
    const userCreateDetails: UserCreateDetails = (await parseFormData(req)) as {
      username: string
      forenames: string
      surname: string
      phoneNumber: string
      emailAddress: string
      postCode: string
      postalAddress: string
      endorsedBy: string
      organisation: string
    }

    if (
      userCreateDetails.username === "" ||
      userCreateDetails.forenames === "" ||
      userCreateDetails.surname === "" ||
      userCreateDetails.phoneNumber === "" ||
      userCreateDetails.emailAddress === ""
    ) {
      missingMandatory = true
    }

    if (!missingMandatory) {
      const connection = getConnection()
      const result = await setupNewUser(connection, userCreateDetails)
      if (isError(result)) {
        return {
          props: { errorMessage: result.message, successMessage: "", missingMandatory }
        }
      }
      return {
        props: { errorMessage: result.errorMessage, successMessage: result.successMessage, missingMandatory }
      }
    }
    errorMessage = "Please make sure that all mandatory fields are non empty"
  }
  return {
    props: { errorMessage, successMessage: "", missingMandatory }
  }
}

interface Props {
  errorMessage: string
  successMessage: string
  missingMandatory: boolean
}

const newUser = ({ errorMessage, successMessage, missingMandatory }: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout>
      <span id="event-name-error" className="govuk-error-message">
        {errorMessage}
      </span>
      {successMessage && <SuccessBanner message={successMessage} />}
      <form method="post">
        <TextInput id="username" name="username" label="Username *" type="text" isError={missingMandatory} />
        <TextInput id="forenames" name="forenames" label="Forename(s) *" type="text" isError={missingMandatory} />
        <TextInput id="surname" name="surname" label="Surname *" type="text" isError={missingMandatory} />
        <TextInput id="phoneNumber" name="phoneNumber" label="Phone number *" type="text" isError={missingMandatory} />
        <TextInput
          id="emailAddress"
          name="emailAddress"
          label="Email address *"
          type="email"
          isError={missingMandatory}
        />

        <TextInput id="postalAddress" name="postalAddress" label="Postal address" type="text" />
        <TextInput id="postCode" name="postCode" label="Postcode" type="text" />
        <TextInput id="endorsedBy" name="endorsedBy" label="Endorsed by" type="text" />
        <TextInput id="orgServes" name="orgServes" label="Organisation" type="text" />

        <Button noDoubleClick>{"Add user"}</Button>
      </form>

      <a href="/users" className="govuk-back-link">
        {" "}
        {"Back"}{" "}
      </a>
    </Layout>
  </>
)

export default newUser
