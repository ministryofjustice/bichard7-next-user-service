import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
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
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import User from "types/User"
import isPost from "utils/isPost"
import { getUserGroups } from "useCases"
import { UserGroupResult } from "types/UserGroup"
import getAuditLogger from "lib/getAuditLogger"
import config from "lib/config"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const missingMandatory = false
    let message = ""
    let isSuccess = true

    if (isPost(req)) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const userCreateDetails: any = formData as {
        username: string
        forenames: string
        surname: string
        phoneNumber: string
        emailAddress: string
        postCode: string
        postalAddress: string
        endorsedBy: string
        orgServes: string
        groupId: string
      }

      const formIsValid = userFormIsValid(userCreateDetails)

      if (formIsValid) {
        const connection = getConnection()
        const auditLogger = getAuditLogger(context, config)
        const result = await setupNewUser(connection, auditLogger, userCreateDetails)

        let userGroups = await getUserGroups(connection)

        if (isError(userGroups)) {
          console.error(userGroups)

          // Temp fix here until we can throw a 500 error page
          userGroups = []
        }

        if (isError(result)) {
          return {
            props: { message: result.message, isSuccess: false, missingMandatory, csrfToken, currentUser, userGroups }
          }
        }

        message = `User ${userCreateDetails.username} has been successfully created.`
        return {
          props: { message, isSuccess: true, missingMandatory, csrfToken, currentUser, userGroups }
        }
      }

      message = "Please fill in all mandatory fields."
      isSuccess = false
    }

    const connection = getConnection()

    let userGroups = await getUserGroups(connection)

    if (isError(userGroups)) {
      console.error(userGroups)

      // Temp fix here until we can throw a 500 error page
      userGroups = []
    }

    return {
      props: { message, isSuccess, missingMandatory, csrfToken, currentUser, userGroups }
    }
  }
)

interface Props {
  message: string
  isSuccess: boolean
  missingMandatory: boolean
  csrfToken: string
  currentUser?: Partial<User>
  userGroups?: UserGroupResult[]
}

const newUser = ({ message, isSuccess, missingMandatory, csrfToken, currentUser, userGroups }: Props) => (
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
          userGroups={userGroups}
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
