import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
import UserCreateDetails from "types/UserDetails"
import getConnection from "lib/getConnection"
import setupNewUser from "useCases/setupNewUser"
import { isError } from "types/Result"
import userFormIsValid from "lib/userFormIsValid"
import UserForm from "components/users/UserForm"
import { useCsrfServerSideProps } from "hooks"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Form from "components/Form"
import { GetServerSidePropsResult } from "next"

export const getServerSideProps = useCsrfServerSideProps(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, formData, csrfToken } = context as CsrfServerSidePropsContext
  const missingMandatory = false
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

    const formIsValid = userFormIsValid(userCreateDetails)

    if (formIsValid) {
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
        <UserForm
          missingUsername={missingMandatory}
          missingForenames={missingMandatory}
          missingPhoneNumber={missingMandatory}
          missingEmail={missingMandatory}
        />

        <Button noDoubleClick>{"Add user"}</Button>
      </Form>

      <a href="/users" className="govuk-back-link">
        {"Back"}
      </a>
    </Layout>
  </>
)

export default newUser
