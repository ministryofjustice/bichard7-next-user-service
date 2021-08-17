import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSideProps } from "next"
import getConnection from "lib/getConnection"
import parseFormData from "lib/parseFormData"
import userFormIsValid from "lib/userFormIsValid"
import UserForm from "components/users/UserForm"
import { getUser, updateUser, getUserById } from "useCases"
import { isError } from "types/Result"
import User from "types/User"

const errorMessageMap = {
  unique_users_username_idx: "This user name has been taken please enter another"
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const connection = getConnection()

  if (req.method === "POST") {
    const userDetails: Partial<User> = await parseFormData(req)
    const user = await getUserById(connection, userDetails.id as string)

    if (isError(user)) {
      console.error(user)
      return {
        props: {
          errorMessage: "Error getting user details please try again"
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
            errorMessage: (errorMessageMap as any)[(userUpdated as any).constraint]
          }
        }
      }

      const updatedUser = await getUserById(connection, userDetails.id as string)

      console.log("updatedUser", updateUser)

      if (isError(updatedUser)) {
        console.error(updateUser)

        return {
          props: {
            errorMessage: "There was an error retrieving the user details"
          }
        }
      }

      return {
        props: {
          successMessage: "The user was updated successfully",
          user: updatedUser
        }
      }
    }
    return {
      props: {
        errorMessage: "Please fill in all mandatory fields",
        missingMandatory: true,
        user: { ...user, ...userDetails }
      }
    }
  }

  const { username } = query
  const user = await getUser(connection, username as string)

  if (isError(user)) {
    console.error(user)

    return {
      props: {
        errorMessage: "Error retrieving user please go back and make sure you have the correct details",
        missingMandatory: false
      }
    }
  }

  return {
    props: {
      missingMandatory: false,
      user
    }
  }
}

interface Props {
  errorMessage: string
  successMessage: string
  missingMandatory: boolean
  user: User
}

const editUser = ({ errorMessage, successMessage, missingMandatory, user }: Props) => (
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
        <form method="post">
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
        </form>
      )}

      <a href="/users" className="govuk-back-link">
        {" "}
        {"Back"}{" "}
      </a>
    </Layout>
  </>
)

export default editUser
