import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSidePropsResult } from "next"
import UserCreateDetails from "types/UserCreateDetails"
import getConnection from "lib/getConnection"
import setupNewUser from "useCases/setupNewUser"
import { isError } from "types/Result"
import { useCsrfServerSideProps } from "hooks"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Form from "components/Form"

export const getServerSideProps = useCsrfServerSideProps(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, formData, csrfToken } = context as CsrfServerSidePropsContext
  let missingMandatory = false
  let message = ""
  let isSuccess = true

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
      const result = await setupNewUser(connection, userCreateDetails)
      if (isError(result)) {
        return {
          props: { message: result.message, isSuccess: false, missingMandatory, csrfToken }
        }
      }
      return {
        props: { message: result.successMessage, isSuccess: true, missingMandatory, csrfToken }
      }
    }
    message = "Please make sure that all mandatory fields are non empty"
    isSuccess = false
  }
  return {
    props: { message, isSuccess, missingMandatory, csrfToken }
  }
})

interface Props {
  message: string
  isSuccess: boolean
  missingMandatory: boolean
  csrfToken: string
}

const newUser = ({ message, isSuccess, missingMandatory, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout>
      {!isSuccess && (
        <span id="event-name-error" className="govuk-error-message">
          {message}
        </span>
      )}
      {isSuccess && message && <SuccessBanner message={message} />}
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
