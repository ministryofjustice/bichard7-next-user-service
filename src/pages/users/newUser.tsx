import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSidePropsResult } from "next"
import UserCreateDetails from "types/UserCreateDetails"
import getConnection from "lib/getConnection"
import createUser from "useCases/createUser"
import { useCsrfServerSideProps } from "hooks"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Form from "components/Form"

export const getServerSideProps = useCsrfServerSideProps(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, formData, csrfToken } = context as CsrfServerSidePropsContext
  let missingMandatory = false
  let errorMessage = ""
  let successMessage = ""

  if (req.method === "POST") {
    const userCreateDetails: UserCreateDetails = formData as {
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
      const result = await createUser(connection, userCreateDetails)
      errorMessage = result.error.message
      if (errorMessage === "") {
        successMessage = `User ${userCreateDetails.username} has been successfully created`
      }
    } else {
      errorMessage = "Please make sure that all mandatory fields are non empty"
    }
  }
  return {
    props: { errorMessage, successMessage, missingMandatory, csrfToken }
  }
})

interface Props {
  errorMessage: string
  successMessage: string
  missingMandatory: boolean
  csrfToken: string
}

const newUser = ({ errorMessage, successMessage, missingMandatory, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout>
      <span id="event-name-error" className="govuk-error-message">
        {errorMessage}
      </span>
      {successMessage && <SuccessBanner message={successMessage} />}
      <Form method="post" csrfToken={csrfToken}>
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
      </Form>

      <a href="/users" className="govuk-back-link">
        {" "}
        {"Back"}{" "}
      </a>
    </Layout>
  </>
)

export default newUser
