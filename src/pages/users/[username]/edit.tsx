import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
import getConnection from "lib/getConnection"
import userFormIsValid from "lib/userFormIsValid"
import UserForm from "components/users/UserForm"
import { updateUser, getUserById, getUserByUsername } from "useCases"
import { isError } from "types/Result"
import User from "types/User"
import { useCsrfServerSideProps } from "hooks"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Form from "components/Form"
import { GetServerSidePropsResult } from "next"

const errorMessageMap = {
  unique_users_username_idx: "This user name has been taken please enter another"
}

export const getServerSideProps = useCsrfServerSideProps(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { query, req, formData, csrfToken } = context as CsrfServerSidePropsContext
  const connection = getConnection()

  if (req.method === "POST") {
    const userDetails: Partial<User> = formData
    const user = await getUserById(connection, userDetails.id as number)

    if (isError(user)) {
      console.error(user)
      return {
        props: {
          errorMessage: "Error getting user details please try again",
          csrfToken
        }
      }
    }

    const formIsValid = userFormIsValid(userDetails)

    if (formIsValid) {
      const userUpdated = await updateUser(connection, userDetails)

      if (isError(userUpdated)) {
        console.error(userUpdated)

        return {
          props: {
            errorMessage: (errorMessageMap as any)[(userUpdated as any).constraint],
            csrfToken
          }
        }
      }

      const updatedUser = await getUserById(connection, userDetails.id as number)

      if (isError(updatedUser)) {
        console.error(updateUser)

        return {
          props: {
            errorMessage: "There was an error retrieving the user details",
            csrfToken
          }
        }
      }

      return {
        props: {
          successMessage: "The user was updated successfully",
          user: updatedUser,
          csrfToken
        }
      }
    }
    return {
      props: {
        errorMessage: "Please fill in all mandatory fields",
        missingMandatory: true,
        user: { ...user, ...userDetails },
        csrfToken
      }
    }
  }

  const { username } = query
  const user = await getUserByUsername(connection, username as string)

  if (isError(user)) {
    console.error(user)

    return {
      props: {
        errorMessage: "Error retrieving user please go back and make sure you have the correct details",
        missingMandatory: false,
        csrfToken
      }
    }
  }

  return {
    props: {
      missingMandatory: false,
      user,
      csrfToken
    }
  }
})

interface Props {
  errorMessage?: string
  successMessage?: string
  missingMandatory?: boolean
  user?: Partial<User> | null
  csrfToken: string
}

const editUser = ({ errorMessage, successMessage, missingMandatory, user, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"Edit User"}</title>
    </Head>
    <Layout>
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
          />
          <input type="hidden" name="id" value={user.id} />
          <Button noDoubleClick>{"Update user"}</Button>
        </Form>
      )}

      <a href="/users" className="govuk-back-link">
        {" "}
        {"Back"}{" "}
      </a>
    </Layout>
  </>
)

export default editUser
