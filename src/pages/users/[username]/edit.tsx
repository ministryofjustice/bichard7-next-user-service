import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
import getConnection from "lib/getConnection"
import userFormIsValid from "lib/userFormIsValid"
import getUserById from "useCases/getUserById"
import { updateUser, getUserByUsername, getUserGroups } from "useCases"
import UserForm, { listOfForces, listOfTriggers } from "components/users/UserForm"
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
import getAuditLogger from "lib/getAuditLogger"
import config from "lib/config"
import BackLink from "components/BackLink"
import { ErrorSummary, ErrorSummaryList } from "components/ErrorSummary"
import createRedirectResponse from "utils/createRedirectResponse"
import updateUserCodes from "useCases/updateUserCodes"
import usersHaveSameForce from "lib/usersHaveSameForce"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const { username } = query as { username: string }

    if (!currentUser || !currentUser.id || !currentUser.username) {
      console.error("Unable to determine current user")
      return createRedirectResponse("/500")
    }

    const connection = getConnection()
    const user = await getUserByUsername(connection, username)

    if (isError(user)) {
      console.error(user)
      return createRedirectResponse("/500")
    }

    if (!user || !usersHaveSameForce(currentUser, user)) {
      return {
        notFound: true
      }
    }

    const groups = await getUserGroups(connection, [currentUser.username, username])

    if (isError(groups)) {
      console.error(groups)
      return createRedirectResponse("/500")
    }

    if (isPost(req)) {
      const userDetails: Partial<User> = formData
      userDetails.visibleForces = updateUserCodes(listOfForces, "visibleForces", formData)

      if (!userDetails.visibleForces || userDetails.visibleForces === "") {
        return {
          props: {
            errorMessage: "Please ensure that user is assigned to least one force.",
            csrfToken,
            currentUser,
            groups,
            user: { ...user, ...userDetails },
            isFormValid: true,
            forcesError: "Please ensure that user is assigned to least one force.",
            currentUserVisibleForces: currentUser.visibleForces ?? ""
          }
        }
      }

      userDetails.excludedTriggers = updateUserCodes(listOfTriggers, "excludedTriggers", formData, false)

      const formValidationResult = userFormIsValid(userDetails, true)

      if (formValidationResult.isFormValid) {
        const groupsChecked = groups.filter((group) => formData[group.name] === "yes")
        userDetails.groups = groupsChecked
        const auditLogger = getAuditLogger(context, config)
        const userUpdated = await updateUser(connection, auditLogger, currentUser.id, userDetails)

        if (isError(userUpdated)) {
          console.error(userUpdated)

          return {
            props: {
              csrfToken,
              currentUser,
              groups,
              ...formValidationResult,
              user: { ...user, ...userDetails },
              errorMessage: userUpdated.message,
              currentUserVisibleForces: currentUser.visibleForces ?? ""
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
              user: { ...user, ...userDetails },
              ...formValidationResult,
              currentUserVisibleForces: currentUser.visibleForces ?? ""
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
            ...formValidationResult,
            currentUserVisibleForces: currentUser.visibleForces ?? ""
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
          ...formValidationResult,
          currentUserVisibleForces: currentUser.visibleForces ?? ""
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
        isFormValid: true,
        currentUserVisibleForces: currentUser.visibleForces ?? ""
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
  forcesError?: string | false
  isFormValid: boolean
  currentUserVisibleForces: string
}

const editUser = ({
  errorMessage,
  successMessage,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  forcesError,
  user,
  csrfToken,
  currentUser,
  groups,
  isFormValid,
  currentUserVisibleForces
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

      <ErrorSummary title="There is a problem" show={!isFormValid}>
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
            forcesError={forcesError}
            allGroups={groups}
            userGroups={user.groups}
            currentUserVisibleForces={currentUserVisibleForces}
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
