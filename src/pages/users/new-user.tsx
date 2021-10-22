import Button from "components/Button"
import Layout from "components/Layout"
import Link from "components/Link"
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
import ButtonGroup from "components/ButtonGroup"
import createRedirectResponse from "utils/createRedirectResponse"
import { ErrorSummary, ErrorSummaryList } from "components/ErrorSummary"
import IsEmailUnique from "useCases/IsEmailUnique"
import isUsernameUnique from "useCases/isUsernameUnique"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    let message = ""
    let isSuccess = true

    if (!currentUser?.username || !currentUser?.id) {
      return createRedirectResponse("/login")
    }

    const connection = getConnection()
    const userGroups = await getUserGroups(connection, [currentUser.username])

    if (isError(userGroups)) {
      console.error(userGroups)
      return createRedirectResponse("/500")
    }

    if (isPost(req)) {
      const userCreateDetails = formData as {
        username: string
        forenames: string
        surname: string
        emailAddress: string
        endorsedBy: string
        orgServes: string
        save: string
        saveAndAddAnother: string
      }

      const formValidationResult = userFormIsValid(userCreateDetails, false)

      if (formValidationResult.isFormValid) {
        const isUsernameUniqueResult = await isUsernameUnique(connection, userCreateDetails.username)

        if (isError(isUsernameUniqueResult)) {
          return {
            props: {
              isSuccess: false,
              isFormValid: false,
              usernameError: isUsernameUniqueResult.message,
              userDetails: userCreateDetails,
              csrfToken,
              currentUser,
              userGroups
            }
          }
        }

        const isEmailAddressUniqueResult = await IsEmailUnique(connection, userCreateDetails.emailAddress)

        if (isError(isEmailAddressUniqueResult)) {
          return {
            props: {
              isSuccess: false,
              isFormValid: false,
              emailError: isEmailAddressUniqueResult.message,
              userDetails: userCreateDetails,
              csrfToken,
              currentUser,
              userGroups
            }
          }
        }

        const auditLogger = getAuditLogger(context, config)
        const result = await setupNewUser(connection, auditLogger, currentUser.id, userCreateDetails)

        if (isError(result)) {
          return {
            props: {
              message: result.message,
              isSuccess: false,
              ...formValidationResult,
              userDetails: userCreateDetails,
              csrfToken,
              currentUser,
              userGroups
            }
          }
        }

        if (userCreateDetails.save === "save") {
          return createRedirectResponse("/users?action=user-created")
        }

        message = `User ${userCreateDetails.username} has been successfully created.`
        return {
          props: {
            message,
            isSuccess: true,
            ...formValidationResult,
            csrfToken,
            currentUser,
            userGroups
          }
        }
      }

      isSuccess = false
      return {
        props: {
          ...formValidationResult,
          userDetails: userCreateDetails,
          message,
          isSuccess,
          csrfToken,
          currentUser,
          userGroups
        }
      }
    }

    return {
      props: { message, isFormValid: true, isSuccess, csrfToken, currentUser, userGroups }
    }
  }
)

interface Props {
  message?: string
  isSuccess: boolean
  usernameError?: string | false
  forenamesError?: string | false
  surnameError?: string | false
  emailError?: string | false
  isFormValid: boolean
  csrfToken: string
  currentUser?: Partial<User>
  userGroups?: UserGroupResult[]
  userDetails?: Partial<User>
}

const NewUser = ({
  message,
  isSuccess,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  csrfToken,
  currentUser,
  userGroups,
  userDetails,
  isFormValid
}: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout user={currentUser}>
      <h1 className="govuk-heading-l">{"Add a new user"}</h1>

      <ErrorSummary title="There is a problem" show={!isFormValid || (!isSuccess && !!message)}>
        <ErrorSummaryList
          items={[
            { id: "username", error: usernameError },
            { id: "forenames", error: forenamesError },
            { id: "surname", error: surnameError },
            { id: "emailAddress", error: emailError },
            { id: "", error: message }
          ]}
        />
      </ErrorSummary>

      {isSuccess && message && <SuccessBanner>{message}</SuccessBanner>}

      <Form method="post" csrfToken={csrfToken}>
        <UserForm
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(userDetails || {})}
          usernameError={usernameError}
          forenamesError={forenamesError}
          emailError={emailError}
          surnameError={surnameError}
          userGroups={userGroups}
        />
        <ButtonGroup>
          <Button name="save" value="save" noDoubleClick>
            {"Save"}
          </Button>
          <Button variant="secondary" name="saveAndAddAnother" value="saveAndAddAnother" noDoubleClick>
            {"Save and add another"}
          </Button>
        </ButtonGroup>
      </Form>

      <Link href="/users" className="govuk-back-link">
        {"Back"}
      </Link>
    </Layout>
  </>
)

export default NewUser