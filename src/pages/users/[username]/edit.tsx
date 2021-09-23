import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
import getConnection from "lib/getConnection"
import userFormIsValid from "lib/userFormIsValid"
import UserForm from "components/users/UserForm"
import { updateUser, getUserById, getUserByUsername, getUserGroups } from "useCases"
import { isError } from "types/Result"
import User from "types/User"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Form from "components/Form"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import isPost from "utils/isPost"
import { UserGroupResult } from "types/UserGroup"
import { Option as UserGroupOption } from "components/Select"
import getAuditLogger from "lib/getAuditLogger"
import config from "lib/config"
import BackLink from "components/BackLink"
import { ErrorSummary, ErrorSummaryList } from "components/ErrorSummary"
import createRedirectResponse from "utils/createRedirectResponse"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const connection = getConnection()

    const groups = await getUserGroups(connection)

    if (isError(groups)) {
      console.error(groups)
      return createRedirectResponse("/500")
    }

    if (isPost(req)) {
      const userDetails: Partial<User> = formData
      const user = await getUserById(connection, userDetails.id as number)

      if (isError(user)) {
        console.error(user)
        return {
          props: {
            errorMessage: "There was an error retrieving the user details.",
            csrfToken,
            currentUser,
            groups,
            isFormValid: true
          }
        }
      }

      const formValidationResult = userFormIsValid(userDetails, true)

      if (formValidationResult.isFormValid) {
        const auditLogger = getAuditLogger(context, config)
        const userUpdated = await updateUser(connection, auditLogger, userDetails)

        if (isError(userUpdated)) {
          console.error(userUpdated)

          return {
            props: {
              csrfToken,
              currentUser,
              groups,
              ...formValidationResult,
              errorMessage: userUpdated.message
            }
          }
        }

        const updatedUser = await getUserById(connection, userDetails.id as number)

        if (isError(updatedUser)) {
          console.error(updateUser)

          return {
            props: {
              errorMessage: "There was an error retrieving the user details.",
              csrfToken,
              currentUser,
              groups,
              ...formValidationResult
            }
          }
        }

        return {
          props: {
            successMessage: "User details updated successfully.",
            user: updatedUser,
            csrfToken,
            currentUser,
            groups,
            ...formValidationResult
          }
        }
      }
      return {
        props: {
          missingMandatory: true,
          user: { ...user, ...userDetails },
          csrfToken,
          currentUser,
          groups,
          ...formValidationResult
        }
      }
    }

    const { username } = query
    const user = await getUserByUsername(connection, username as string)

    if (isError(user)) {
      console.error(user)

      return {
        props: {
          errorMessage: "User not found.",
          missingMandatory: false,
          csrfToken,
          currentUser,
          groups,
          isFormValid: true
        }
      }
    }

    return {
      props: {
        missingMandatory: false,
        user,
        csrfToken,
        currentUser,
        groups,
        isFormValid: true
      }
    }
  }
)

interface Props {
  errorMessage?: string
  successMessage?: string
  missingMandatory?: boolean
  user?: Partial<User> | null
  csrfToken: string
  currentUser?: Partial<User>
  groups: UserGroupResult[]
  usernameError?: string | false
  forenamesError?: string | false
  surnameError?: string | false
  emailError?: string | false
  isFormValid: boolean
}

const editUser = ({
  errorMessage,
  successMessage,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  user,
  csrfToken,
  currentUser,
  groups,
  isFormValid
}: Props) => (
  <>
    <Head>
      <title>{"Edit User"}</title>
    </Head>
    <Layout user={currentUser}>
      <h1 className="govuk-heading-l">
        {"Edit "}
        {(user && user.username) || "user"}
        {"'s details"}
      </h1>
      <ErrorSummary title="Error" show={!!errorMessage}>
        {errorMessage}
      </ErrorSummary>

      <ErrorSummary title="Please fix the followings:" show={!isFormValid}>
        <ErrorSummaryList
          items={[
            { id: "username", error: usernameError },
            { id: "forenames", error: forenamesError },
            { id: "surname", error: surnameError },
            { id: "emailAddress", error: emailError }
          ]}
        />
      </ErrorSummary>

      {successMessage && <SuccessBanner>{successMessage}</SuccessBanner>}

      {user && (
        <Form method="post" csrfToken={csrfToken}>
          <UserForm
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...user}
            usernameError={usernameError}
            forenamesError={forenamesError}
            surnameError={surnameError}
            emailError={emailError}
            userGroups={groups as unknown as UserGroupOption[]}
            isEdit
          />
          <input type="hidden" name="id" value={user.id} />
          <Button noDoubleClick>{"Update user"}</Button>
        </Form>
      )}

      <BackLink href="/users" />
    </Layout>
  </>
)

export default editUser
