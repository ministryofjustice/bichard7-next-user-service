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
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Form from "components/Form"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSideProps from "types/AuthenticationServerSideProps"
import User from "types/User"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSideProps
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
            props: { message: result.message, isSuccess: false, missingMandatory, csrfToken, currentUser }
          }
        }

        message = `User ${userCreateDetails.username} has been successfully created`
        return {
          props: { message, isSuccess: true, missingMandatory, csrfToken, currentUser }
        }
      }

      message = "Please make sure that all mandatory fields are non empty"
      isSuccess = false
    }

    return {
      props: { message, isSuccess, missingMandatory, csrfToken, currentUser }
    }
  }
)

interface Props {
  message: string
  isSuccess: boolean
  missingMandatory: boolean
  csrfToken: string
  currentUser?: Partial<User>
}

const newUser = ({ message, isSuccess, missingMandatory, csrfToken, currentUser }: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout user={currentUser}>
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
