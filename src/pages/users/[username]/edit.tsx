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

const errorMessageMap = {
  unique_users_username_idx: "This username already exists. Please try a different one."
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const connection = getConnection()

    let groups = await getUserGroups(connection)

    if (isError(groups)) {
      console.error(groups)

      // Temp fix here until we can throw a 500 error page
      groups = []
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
            groups
          }
        }
      }

      const formIsValid = userFormIsValid(userDetails)

      if (formIsValid) {
        const auditLogger = getAuditLogger(context, config)
        const userUpdated = await updateUser(connection, auditLogger, userDetails)

        if (isError(userUpdated)) {
          console.error(userUpdated)

          return {
            props: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              errorMessage: (errorMessageMap as any)[(userUpdated as any).constraint] || (userUpdated as any).message,
              csrfToken,
              currentUser,
              groups
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
              groups
            }
          }
        }

        return {
          props: {
            successMessage: "User details updated successfully.",
            user: updatedUser,
            csrfToken,
            currentUser,
            groups
          }
        }
      }
      return {
        props: {
          errorMessage: "Please fill in all mandatory fields.",
          missingMandatory: true,
          user: { ...user, ...userDetails },
          csrfToken,
          currentUser,
          groups
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
          groups
        }
      }
    }

    return {
      props: {
        missingMandatory: false,
        user,
        csrfToken,
        currentUser,
        groups
      }
    }
  }
)

interface Props {
  errorMessage?: string
  successMessage?: string
  missingMandatory?: boolean
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  user?: any | null
  csrfToken: string
  currentUser?: Partial<User>
  groups: UserGroupResult[]
}

const editUser = ({ errorMessage, successMessage, missingMandatory, user, csrfToken, currentUser, groups }: Props) => (
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
      <span id="event-name-error" className="govuk-error-message">
        {errorMessage}
      </span>
      {successMessage && <SuccessBanner message={successMessage} />}
      {user && (
        <Form method="post" csrfToken={csrfToken}>
          <UserForm
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...user}
            missingUsername={missingMandatory}
            missingForenames={missingMandatory}
            missingSurname={missingMandatory}
            missingPhoneNumber={missingMandatory}
            missingEmail={missingMandatory}
            disableEmailField
            userGroups={groups as unknown as UserGroupOption[]}
          />
          <input type="hidden" name="id" value={user.id} />
          <Button noDoubleClick>{"Update user"}</Button>
        </Form>
      )}

      <a href="/users" className="govuk-back-link">
        {"Back"}
      </a>
    </Layout>
  </>
)

export default editUser
